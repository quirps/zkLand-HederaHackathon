const { buildPoseidon } = require("circomlibjs");
const { newMemEmptyTrie } = require("circomlibjs");
const { TextEncoder } = require("util"); // Node.js built-in
const fs = require("fs"); // Import fs to write files

// Helper function to hash using Poseidon (takes BigInts, returns BigInt)
async function poseidonHash(inputs) {
  const poseidon = await buildPoseidon();
  const processedInputs = inputs.map((inp) => BigInt(inp));
  const result = poseidon(processedInputs);
  return poseidon.F.toObject(result);
}

// Helper: Pack bytes into field elements (max 31 bytes per element for bn128)
function packBytesToFields(bytes) {
  const fieldSize = 31; // Max bytes per field element for bn128 safety
  const fields = [];
  for (let i = 0; i < bytes.length; i += fieldSize) {
    const chunk = bytes.slice(i, i + fieldSize);
    let fieldElement = 0n;
    let power = 1n;
    // Pack bytes into a BigInt (little-endian packing)
    for (let j = 0; j < chunk.length; j++) {
      fieldElement += BigInt(chunk[j]) * power;
      power *= 256n; // Equivalent to power <<= 8n;
    }
    fields.push(fieldElement);
  }
  // If empty string, push a 0 field element
  if (fields.length === 0) {
    fields.push(0n);
  }
  return fields;
}

// Helper: Hash a string using Poseidon by packing its bytes
async function poseidonHashString(inputString) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(inputString);
  const packedFields = packBytesToFields(bytes);
  return await poseidonHash(packedFields);
}

async function generateData() {
  console.log("Generating valid mock data (with proper string hashing)...");

  // --- Define Base Values ---
  const owner_secret = 131415n;
  const parcel_id_string = "LAND-PARCEL-42"; // Actual string
  const area_m2 = 150n;
  const right_type = 3n;
  const district_id = 7n;
  const schema_id_string = "UgandaLandSchemaV1.0"; // Actual string
  const issuer_id_string = "MinistryOfLands"; // Actual string

  // --- Calculate Hashes ---
  console.log("Hashing strings...");
  // Hash the strings correctly using byte packing
  const parcel_id_hash = await poseidonHashString(parcel_id_string);
  const schema_hash = await poseidonHashString(schema_id_string);
  const issuer_id_hash = await poseidonHashString(issuer_id_string);
  const owner_commitment_public = await poseidonHash([owner_secret]);
  console.log("String hashing done.");

  // --- Calculate Leaf Hash for Ownership Tree ---
  const leafInputs = [
    parcel_id_hash,
    owner_commitment_public,
    area_m2,
    right_type,
    district_id,
    schema_hash,
    issuer_id_hash,
  ];
  const ownership_leaf_hash = await poseidonHash(leafInputs);

  // --- SMT Depths ---
  const ownership_depth = 16;
  const schema_depth = 16;
  const issuer_depth = 16;

  console.log("Building SMTs with library...");

  // --- Ownership Tree ---
  const poseidon = await buildPoseidon();
  const ownershipTree = await newMemEmptyTrie(poseidon);
  const ownershipFr = ownershipTree.F;
  await ownershipTree.insert(ownership_leaf_hash, 1n);
  const ownershipRoot = ownershipFr.toObject(ownershipTree.root);
  const ownershipRes = await ownershipTree.find(ownershipFr.e(ownership_leaf_hash));
  let ownershipSiblings = ownershipRes.siblings.map(s => ownershipFr.toObject(s));
  while (ownershipSiblings.length < ownership_depth) {
    ownershipSiblings.push(0n);
  }

  // --- Schema Tree ---
  const schemaTree = await newMemEmptyTrie(poseidon);
  const schemaFr = schemaTree.F;
  await schemaTree.insert(schema_hash, 1n);
  const schemaRoot = schemaFr.toObject(schemaTree.root);
  const schemaRes = await schemaTree.find(schemaFr.e(schema_hash));
  let schemaSiblings = schemaRes.siblings.map(s => schemaFr.toObject(s));
  while (schemaSiblings.length < schema_depth) {
    schemaSiblings.push(0n);
  }

  // --- Issuer Tree ---
  const issuerTree = await newMemEmptyTrie(poseidon);
  const issuerFr = issuerTree.F;
  await issuerTree.insert(issuer_id_hash, 1n);
  const issuerRoot = issuerFr.toObject(issuerTree.root);
  const issuerRes = await issuerTree.find(issuerFr.e(issuer_id_hash));
  let issuerSiblings = issuerRes.siblings.map(s => issuerFr.toObject(s));
  while (issuerSiblings.length < issuer_depth) {
    issuerSiblings.push(0n);
  }

  console.log("SMTs built and proofs extracted.");

  // --- Define Public Inputs for Circuit ---
  const area_threshold = 100n;
  const district_expected = 7n;
  const reveal_flag = 1n;
  const disclosed_right_type = right_type * reveal_flag;

  // --- Assemble input.json ---
  const inputJson = {
    ownership_root: ownershipRoot.toString(),
    schema_root: schemaRoot.toString(),
    issuer_root: issuerRoot.toString(),
    owner_commitment_public: owner_commitment_public.toString(),
    area_threshold: area_threshold.toString(),
    district_expected: district_expected.toString(),
    reveal_flag: reveal_flag.toString(),

    owner_secret: owner_secret.toString(),
    parcel_id_hash: parcel_id_hash.toString(), // Now the hash of the string
    schema_hash: schema_hash.toString(), // Now the hash of the string
    issuer_id_hash: issuer_id_hash.toString(), // Now the hash of the string
    area_m2: area_m2.toString(),
    district_id: district_id.toString(),
    right_type: right_type.toString(),

    ownership_siblings: ownershipSiblings.map((s) => s.toString()),
    schema_siblings: schemaSiblings.map((s) => s.toString()),
    issuer_siblings: issuerSiblings.map((s) => s.toString()),
  };

  // --- Assemble public.json ---
  const publicJson = {
    ownership_root: ownershipRoot.toString(),
    schema_root: schemaRoot.toString(),
    issuer_root: issuerRoot.toString(),
    owner_commitment_public: owner_commitment_public.toString(),
    area_threshold: area_threshold.toString(),
    district_expected: district_expected.toString(),
    reveal_flag: reveal_flag.toString(),
    disclosed_right_type: disclosed_right_type.toString(),
  };

  // --- Output JSON ---
  fs.writeFileSync("input.json", JSON.stringify(inputJson, null, 2));
  fs.writeFileSync("public.json", JSON.stringify(publicJson, null, 2));

  console.log("\nGenerated input.json and public.json with valid SMT data.");
  console.log(
    "Parcel ID String:",
    parcel_id_string,
    "-> Hash:",
    parcel_id_hash.toString()
  );
  console.log(
    "Schema ID String:",
    schema_id_string,
    "-> Hash:",
    schema_hash.toString()
  );
  console.log(
    "Issuer ID String:",
    issuer_id_string,
    "-> Hash:",
    issuer_id_hash.toString()
  );
  console.log("Ownership Root:", ownershipRoot.toString());
  console.log("Schema Root:", schemaRoot.toString());
  console.log("Issuer Root:", issuerRoot.toString());
}

generateData().catch(console.error);