const { buildPoseidon } = require("circomlibjs");
const { Scalar } = require("ffjavascript"); // Required for bigint field math
const { TextEncoder } = require('util'); // Node.js built-in

// Helper function to hash using Poseidon (takes BigInts, returns BigInt)
async function poseidonHash(inputs) {
  const poseidon = await buildPoseidon();
  const processedInputs = inputs.map(inp => BigInt(inp));
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


// Helper: Get BigInt bits for path derivation (LSB first)
function getBits(inputBigInt, numBits) {
    const bits = [];
    let temp = BigInt(inputBigInt);
    for (let i = 0; i < numBits; i++) {
        bits.push(Number(temp & 1n));
        temp = temp >> 1n;
    }
    return bits;
}

// Helper: Calculate default zero hashes for SMT
async function calculateZeroHashes(depth) {
    const zeroHashes = [0n];
    let currentHash = 0n;
    for (let i = 0; i < depth; i++) {
        currentHash = await poseidonHash([currentHash, currentHash]);
        zeroHashes.push(currentHash);
    }
    return zeroHashes.reverse();
}

// Helper: Calculate SMT root and siblings
async function calculateSmtProof(key, value, depth, zeroHashes) {
    const pathBits = getBits(key, depth);
    const siblings = [];
    // Standard SMT leaf hash might just be H(value), or H(key, value).
    // Let's use H(key, value) as before. Check your SmtVerifier implementation.
let currentHash = await poseidonHash([BigInt(key), BigInt(value), 1n]);
    const levelZeroHashes = zeroHashes.slice(1).reverse();

    for (let i = 0; i < depth; i++) {
        const siblingDefaultHash = levelZeroHashes[i];
        let left, right;
        if (pathBits[i] === 0) {
            left = currentHash;
            right = siblingDefaultHash;
            siblings.push(right);
        } else {
            left = siblingDefaultHash;
            right = currentHash;
            siblings.push(left);
        }
        currentHash = await poseidonHash([left, right]);
    }
    const root = currentHash;
    return { root, siblings };
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
    const issuer_id_string = "MinistryOfLands";      // Actual string

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
        parcel_id_hash, owner_commitment_public, area_m2,
        right_type, district_id, schema_hash, issuer_id_hash
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
    const ownershipProof = await calculateSmtProof(ownership_leaf_hash, 1n, ownership_depth, ownershipZeroHashes);
    const schemaProof = await calculateSmtProof(schema_hash, 1n, schema_depth, schemaZeroHashes);
    const issuerProof = await calculateSmtProof(issuer_id_hash, 1n, issuer_depth, issuerZeroHashes);
    console.log("SMT proofs calculated.");

    // --- Define Public Inputs for Circuit ---
    const area_threshold = 100n;
    const district_expected = 7n;
    const reveal_flag = 1n;
    const disclosed_right_type = right_type * reveal_flag;

    // --- Assemble input.json ---
    const inputJson = {
        ownership_root: ownershipProof.root.toString(),
        schema_root: schemaProof.root.toString(),
        issuer_root: issuerProof.root.toString(),
        owner_commitment_public: owner_commitment_public.toString(),
        area_threshold: area_threshold.toString(),
        district_expected: district_expected.toString(),
        reveal_flag: reveal_flag.toString(),

        owner_secret: owner_secret.toString(),
        parcel_id_hash: parcel_id_hash.toString(), // Now the hash of the string
        schema_hash: schema_hash.toString(),       // Now the hash of the string
        issuer_id_hash: issuer_id_hash.toString(), // Now the hash of the string
        area_m2: area_m2.toString(),
        district_id: district_id.toString(),
        right_type: right_type.toString(),

        ownership_siblings: ownershipProof.siblings.map(s => s.toString()),
        schema_siblings: schemaProof.siblings.map(s => s.toString()),
        issuer_siblings: issuerProof.siblings.map(s => s.toString()),
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
    console.log("Parcel ID String:", parcel_id_string, "-> Hash:", parcel_id_hash.toString());
    console.log("Schema ID String:", schema_id_string, "-> Hash:", schema_hash.toString());
    console.log("Issuer ID String:", issuer_id_string, "-> Hash:", issuer_id_hash.toString());
    console.log("Ownership Root:", ownershipProof.root.toString());
}

generateData().catch(console.error);