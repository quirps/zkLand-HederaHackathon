// check_root.js
// Usage: node check_root.js input.json
const fs = require("fs");
const circomlib = require("circomlibjs");

function toBigInt(x){
  try { return BigInt(x); } catch(e) { return BigInt(x.toString()); }
}

(async () => {
  if (process.argv.length < 3) {
    console.error("Usage: node check_root.js input.json");
    process.exit(1);
  }
  const inFile = process.argv[2];
  const raw = JSON.parse(fs.readFileSync(inFile, "utf8"));

  const nLevels = raw.siblings.length;
  console.log("Loaded input:", inFile, "nLevels:", nLevels);

  const poseidon = await circomlib.buildPoseidon();
  const F = poseidon.F;
  // helper to ensure values are field elements (BigInt mod p)
  function toField(x){
    const bi = toBigInt(x);
    return (bi % BigInt(F.p) + BigInt(F.p)) % BigInt(F.p);
  }

  // read values from input JSON and normalize
  const key = toField(raw.key);
  const value = toField(raw.value);
  const providedRoot = toField(raw.root);
  let siblings = raw.siblings.map(s => toField(s));

  // --- HASH FUNCTIONS ---
  function poseidonHash3(a, b, c) {
    const res = poseidon([a, b, c]);
    return BigInt(F.toString(res));
  }
  
  function poseidonHash2(a, b) {
    const res = poseidon([a, b]);
    return BigInt(F.toString(res));
  }
  
  const leaf = poseidonHash3(key, value, 1n); 

  console.log("Key:", key.toString());
  console.log("Value:", value.toString());
  console.log("Provided root:", providedRoot.toString());
  console.log("Leaf hash:", leaf.toString());

  // --- COMPUTE EFFECTIVE DEPTH ---
  // Find first zero sibling from top (insertion starts here; effective path length)
  let effectiveDepth = nLevels;
  for (let i = 0; i < nLevels; i++) {
    if (siblings[i] === 0n) {
      effectiveDepth = i;  // Levels 0 to i-1 are effective
      break;
    }
  }
  console.log("Effective depth:", effectiveDepth);  // Should be 1

  // --- RECALC ROOT OVER EFFECTIVE PATH ONLY (bottom-to-top) ---
  let cur = leaf;
  console.log("\n--- Reconstructing over effective path (sparse minimal) ---");
  for (let i = effectiveDepth - 1; i >= 0; i--) {
    const sibling = siblings[i];
    const bit = (key >> BigInt(i)) & 1n;
    let left, right;
    
    if (bit === 0n) {
      left = cur;
      right = sibling;
    } else {
      left = sibling;
      right = cur;
    }
    
    cur = poseidonHash2(left, right);
    console.log(`Level ${i}: bit=${bit}, sibling=${sibling}, cur=${cur}`);
  }

  console.log("Computed root:", cur.toString(), cur === providedRoot ? "-- MATCH" : "-- MISMATCH");
  
})();