const fs = require("fs");
// We need both the SMT library and the poseidon hash builder
const { newMemEmptyTrie, buildPoseidon } = require("circomlibjs");

async function main() {
  // --- CONFIG ---
  const nLevels = 10; // Matches circuit depth
  
  const poseidon = await buildPoseidon();
  const tree = await newMemEmptyTrie(poseidon); // Pass poseidon to the tree
  const Fr = tree.F;

  // --- POPULATE TREE ---
  await tree.insert(7, 77);
  await tree.insert(8, 88);
  await tree.insert(32, 3232);

  // Log the actual tree root for debugging
  console.log("Actual tree root:", Fr.toObject(tree.root));

  // --- FIND KEY AND GET FULL PATH ---
  const key = Fr.e(7);
  const res = await tree.find(key);

  if (!res.found) throw new Error("Key not found in SMT!");

  const value = Fr.toObject(res.foundValue);
  const keyBigInt = Fr.toObject(key);

  // --- CORRECTED SIBLINGS PREP ---
  // res.siblings is top-to-bottom, effective length only (here=1)
  let effectiveSiblings = res.siblings.map(s => Fr.toObject(s));
  console.log("Effective siblings length:", effectiveSiblings.length); // Should be 1

  // Pad for circuit input
  let siblings = effectiveSiblings.slice();
  while (siblings.length < nLevels) {
    siblings.push(0n); // Bottom-pad zeros
  }

  // --- USE LIBRARY ROOT (correct, minimal hashing) ---
  const root = Fr.toObject(tree.root); 

  // Build the input object (all values as strings for JSON)
  const input = {
    enabled: "1",
    fnc: "0",
    root: root.toString(),
    siblings: siblings.map(s => s.toString()), // Top-to-bottom, padded
    oldKey: "0",
    oldValue: "0",
    isOld0: "0", 
    key: keyBigInt.toString(),
    value: value.toString()
  };

  fs.writeFileSync("input.json", JSON.stringify(input, null, 2));
  console.log("[✓] Generated SMTVerifier input.json");
  console.log("New root:", root.toString());
  console.log(input);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});