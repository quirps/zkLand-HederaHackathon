const { buildPoseidon } = require("circomlibjs");
const { Scalar } = require("ffjavascript"); // Required for bigint field math

// Helper function to hash using Poseidon (takes BigInts, returns BigInt)
async function poseidonHash(inputs) {
  const poseidon = await buildPoseidon();
  // Ensure inputs are BigInts or convert them
  const processedInputs = inputs.map(inp => BigInt(inp));
  const result = poseidon(processedInputs);
  // Output is a Buffer, convert it to BigInt in Field
  return poseidon.F.toObject(result);
}

// Helper: Get BigInt bits for path derivation (LSB first)
function getBits(inputBigInt, numBits) {
    const bits = [];
    let temp = BigInt(inputBigInt);
    for (let i = 0; i < numBits; i++) {
        bits.push(Number(temp & 1n)); // Get the least significant bit
        temp = temp >> 1n; // Right shift
    }
    return bits; // Returns LSB first, e.g., 5 (101) -> [1, 0, 1]
}

// Helper: Calculate default zero hashes for SMT
async function calculateZeroHashes(depth) {
    const zeroHashes = [0n]; // Level 0 default is 0
    let currentHash = 0n;
    for (let i = 0; i < depth; i++) {
        currentHash = await poseidonHash([currentHash, currentHash]);
        zeroHashes.push(currentHash);
    }
    return zeroHashes.reverse(); // Return root-first [ZERO_depth, ..., ZERO_0]
}

// Helper: Calculate SMT root and siblings
async function calculateSmtProof(key, value, depth, zeroHashes) {
    const pathBits = getBits(key, depth); // LSB first, determines path [level 0 bit, level 1 bit,...]
    const siblings = [];
    let currentHash = await poseidonHash([BigInt(key), BigInt(value)]); // Leaf hash: H(key, value)

    // zeroHashes is root-first [ZERO_depth, ..., ZERO_1, ZERO_0]
    // We need ZERO_0, ZERO_1, ... ZERO_{depth-1}
    const levelZeroHashes = zeroHashes.slice(1).reverse(); // [ZERO_0, ... ZERO_{depth-1}]

    for (let i = 0; i < depth; i++) {
        const siblingDefaultHash = levelZeroHashes[i]; // Default hash for this level if branch is empty
        let left, right;
        if (pathBits[i] === 0) { // We are the left child
            left = currentHash;
            right = siblingDefaultHash; // Assume sibling is empty for simplicity
            siblings.push(right);
        } else { // We are the right child
            left = siblingDefaultHash; // Assume sibling is empty
            right = currentHash;
            siblings.push(left);
        }
        currentHash = await poseidonHash([left, right]);
    }
    const root = currentHash;
    return { root, siblings };
}


async function generateData() {
    console.log("Generating valid mock data...");

    // --- Define Base Values ---
    const owner_secret = 131415n; // BigInt
    const parcel_id_string = "LAND-PARCEL-42"; // Example ID
    const area_m2 = 150n;
    const right_type = 3n; // freehold
    const district_id = 7n;
    const schema_id = "UgandaLandSchemaV1.0";
    const issuer_id = "MinistryOfLands";

    // --- Calculate Hashes ---
    // Note: In real app, hash strings piece by piece if too long for Poseidon input
    const parcel_id_hash = await poseidonHash([Scalar.fromString(parcel_id_string)]);
    const schema_hash = await poseidonHash([Scalar.fromString(schema_id)]);
    const issuer_id_hash = await poseidonHash([Scalar.fromString(issuer_id)]);
    const owner_commitment_public = await poseidonHash([owner_secret]);

    // --- Calculate Leaf Hash for Ownership Tree ---
    const leafInputs = [
        parcel_id_hash,
        owner_commitment_public,
        area_m2,
        right_type,
        district_id,
        schema_hash,
        issuer_id_hash
    ];
    const ownership_leaf_hash = await poseidonHash(leafInputs);

    // --- Calculate SMT Roots and Siblings ---
    const ownership_depth = 16;
    const schema_depth = 8;
    const issuer_depth = 8;

    console.log("Calculating default zero hashes (this takes a moment)...");
    const ownershipZeroHashes = await calculateZeroHashes(ownership_depth);
    const schemaZeroHashes = await calculateZeroHashes(schema_depth);
    const issuerZeroHashes = await calculateZeroHashes(issuer_depth);
    console.log("Zero hashes calculated.");

    console.log("Calculating SMT proofs...");
    // Ownership Tree Proof (Key: ownership_leaf_hash, Value: 1 meaning "exists")
    const ownershipProof = await calculateSmtProof(ownership_leaf_hash, 1n, ownership_depth, ownershipZeroHashes);
    // Schema Tree Proof (Key: schema_hash, Value: 1 meaning "exists")
    const schemaProof = await calculateSmtProof(schema_hash, 1n, schema_depth, schemaZeroHashes);
    // Issuer Tree Proof (Key: issuer_id_hash, Value: 1 meaning "exists")
    const issuerProof = await calculateSmtProof(issuer_id_hash, 1n, issuer_depth, issuerZeroHashes);
    console.log("SMT proofs calculated.");

    // --- Define Public Inputs for Circuit ---
    const area_threshold = 100n;
    const district_expected = 7n; // Match the district_id
    const reveal_flag = 1n; // Reveal the right_type

    // Calculated public output
    const disclosed_right_type = right_type * reveal_flag;

    // --- Assemble input.json ---
    // Convert BigInts to Strings for JSON compatibility
    const inputJson = {
        ownership_root: ownershipProof.root.toString(),
        schema_root: schemaProof.root.toString(),
        issuer_root: issuerProof.root.toString(),
        owner_commitment_public: owner_commitment_public.toString(),
        area_threshold: area_threshold.toString(),
        district_expected: district_expected.toString(),
        reveal_flag: reveal_flag.toString(),

        owner_secret: owner_secret.toString(),
        parcel_id_hash: parcel_id_hash.toString(),
        schema_hash: schema_hash.toString(),
        issuer_id_hash: issuer_id_hash.toString(),
        area_m2: area_m2.toString(),
        district_id: district_id.toString(),
        right_type: right_type.toString(),

        ownership_siblings: ownershipProof.siblings.map(s => s.toString()),
        // No indices needed for SMT
        schema_siblings: schemaProof.siblings.map(s => s.toString()),
        // No indices needed
        issuer_siblings: issuerProof.siblings.map(s => s.toString()),
        // No indices needed
    };

     // --- Assemble public.json ---
     const publicJson = {
        ownership_root: ownershipProof.root.toString(),
        schema_root: schemaProof.root.toString(),
        issuer_root: issuerProof.root.toString(),
        owner_commitment_public: owner_commitment_public.toString(),
        area_threshold: area_threshold.toString(),
        district_expected: district_expected.toString(),
        reveal_flag: reveal_flag.toString(),
        disclosed_right_type: disclosed_right_type.toString()
    };

    // --- Output JSON ---
    const fs = require('fs');
    fs.writeFileSync('input.json', JSON.stringify(inputJson, null, 2));
    fs.writeFileSync('public.json', JSON.stringify(publicJson, null, 2));

    console.log("\nGenerated input.json and public.json with valid SMT data.");
    console.log("Ownership Root:", ownershipProof.root.toString());
}

generateData().catch(console.error);