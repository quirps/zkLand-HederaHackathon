pragma circom 2.0.0;

// === IMPORT CIRCOMLIB ===
include "../../../node_modules/circomlib/circuits/poseidon.circom";
// Use SMT Verifier instead of MerkleTreeChecker
include "../../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../../../node_modules/circomlib/circuits/comparators.circom";

// === TEMPLATE 1: InclusionProver ===
// Uses SmtVerifier for Merkle inclusion proofs
template InclusionProver(ownership_depth, schema_depth, issuer_depth) {
    // Inputs (Pins for this component)
    signal input ownership_root;
    signal input schema_root;
    signal input issuer_root;
    signal input owner_commitment_public;

    signal input parcel_id_hash;
    signal input area_m2;
    signal input right_type;
    signal input district_id;
    signal input schema_hash;
    signal input issuer_id_hash;

    // Renamed path input to match 'siblings'
    signal input ownership_siblings[ownership_depth];
    // Path indices are not needed for SMT
    signal input schema_siblings[schema_depth];
    // Path indices are not needed
    signal input issuer_siblings[issuer_depth];
    // Path indices are not needed

    // --- Logic ---
    component leafHasher = Poseidon(7);
    leafHasher.inputs[0] <== parcel_id_hash;
    leafHasher.inputs[1] <== owner_commitment_public;
    leafHasher.inputs[2] <== area_m2;
    leafHasher.inputs[3] <== right_type;
    leafHasher.inputs[4] <== district_id;
    leafHasher.inputs[5] <== schema_hash;
    leafHasher.inputs[6] <== issuer_id_hash;
    signal leaf; // This is the hash being inserted/checked in the ownership tree
    leaf <== leafHasher.out;

    // --- Ownership SMT Check ---
    component ownershipChecker = SMTVerifier(ownership_depth);
    ownershipChecker.enabled <== 1;         // Enable the check
    ownershipChecker.fnc <== 0;             // Assuming 0 is for inclusion check/verify
    ownershipChecker.root <== ownership_root; // Wire the root
    ownershipChecker.key <== leaf;          // The calculated leaf hash is the SMT 'key'
    ownershipChecker.value <== 1;           // Assuming value=1 means "key exists"
    ownershipChecker.oldKey <== 0;          // Not an update proof
    ownershipChecker.oldValue <== 0;        // Assume the leaf was previously empty
    ownershipChecker.isOld0 <== 0;          // isOld0=1 means previous value was 0
    for (var i = 0; i < ownership_depth; i++) {
        ownershipChecker.siblings[i] <== ownership_siblings[i]; // Wire siblings
    }

    // --- Schema SMT Check ---
    component schemaChecker = SMTVerifier(schema_depth);
    schemaChecker.enabled <== 1;
    schemaChecker.fnc <== 0;
    schemaChecker.root <== schema_root;
    schemaChecker.key <== schema_hash;      // schema_hash is the SMT 'key'
    schemaChecker.value <== 1;              // Assuming value=1 means "key exists"
    schemaChecker.oldKey <== 0;
    schemaChecker.oldValue <== 0;
    schemaChecker.isOld0 <== 0;
    for (var i = 0; i < schema_depth; i++) {
        schemaChecker.siblings[i] <== schema_siblings[i];
    }

    // --- Issuer SMT Check ---
    component issuerChecker = SMTVerifier(issuer_depth);
    issuerChecker.enabled <== 1;
    issuerChecker.fnc <== 0;
    issuerChecker.root <== issuer_root;
    issuerChecker.key <== issuer_id_hash;   // issuer_id_hash is the SMT 'key'
    issuerChecker.value <== 1;              // Assuming value=1 means "key exists"
    issuerChecker.oldKey <== 0;
    issuerChecker.oldValue <== 0;
    issuerChecker.isOld0 <== 0;
    for (var i = 0; i < issuer_depth; i++) {
        issuerChecker.siblings[i] <== issuer_siblings[i];
    }
}


// === TEMPLATE 2: BusinessLogicChecker ===
// (This template remains unchanged from the previous correct version)
template BusinessLogicChecker() {
    signal input area_threshold;
    signal input district_expected;
    signal input reveal_flag;
    signal input area_m2;
    signal input district_id;
    signal input right_type;
    signal output disclosed_right_type;

    component areaCheck = GreaterEqThan(32);
    areaCheck.in[0] <== area_m2;
    areaCheck.in[1] <== area_threshold;
    areaCheck.out === 1;

    component isDistrictEqual = IsEqual();
    isDistrictEqual.in[0] <== district_id;
    isDistrictEqual.in[1] <== district_expected;
    component isCheckSkipped = IsZero();
    isCheckSkipped.in <== district_expected;
    signal districtCheckValid;
    districtCheckValid <== isDistrictEqual.out + isCheckSkipped.out;
    component finalDistrictCheck = IsZero();
    finalDistrictCheck.in <== districtCheckValid;
    finalDistrictCheck.out === 0;

    reveal_flag * (1 - reveal_flag) === 0;
    disclosed_right_type <== right_type * reveal_flag;
}


// === FINAL ASSEMBLY: The MonoCircuit ===
template MonoCircuit(
    ownership_depth,
    schema_depth,
    issuer_depth
) {
    // Inputs/Outputs for THIS template
    signal input ownership_root;
    signal input schema_root;
    signal input issuer_root;
    signal input owner_commitment_public;
    signal input area_threshold;
    signal input district_expected;
    signal input reveal_flag;
    signal output disclosed_right_type;

    signal input owner_secret;
    signal input parcel_id_hash;
    signal input schema_hash;
    signal input issuer_id_hash;
    // Renamed path inputs to match SmtVerifier's 'siblings'
    signal input ownership_siblings[ownership_depth];
    signal input schema_siblings[schema_depth];
    signal input issuer_siblings[issuer_depth];
    // Index inputs are removed
    signal input area_m2;
    signal input district_id;
    signal input right_type;

    // === Instantiate Components & Wire Signals ===
    component ownershipProver = Poseidon(1);
    ownershipProver.inputs[0] <== owner_secret;
    ownershipProver.out === owner_commitment_public;

    component inclusionProver = InclusionProver(ownership_depth, schema_depth, issuer_depth);
    // Wire public inputs for InclusionProver
    inclusionProver.ownership_root <== ownership_root;
    inclusionProver.schema_root <== schema_root;
    inclusionProver.issuer_root <== issuer_root;
    inclusionProver.owner_commitment_public <== owner_commitment_public;
    // Wire private inputs for InclusionProver
    inclusionProver.parcel_id_hash <== parcel_id_hash;
    inclusionProver.area_m2 <== area_m2;
    inclusionProver.right_type <== right_type;
    inclusionProver.district_id <== district_id;
    inclusionProver.schema_hash <== schema_hash;
    inclusionProver.issuer_id_hash <== issuer_id_hash;
    // Wire siblings (paths)
    for (var i = 0; i < ownership_depth; i++) {
        inclusionProver.ownership_siblings[i] <== ownership_siblings[i];
    }
    for (var i = 0; i < schema_depth; i++) {
        inclusionProver.schema_siblings[i] <== schema_siblings[i];
    }
    for (var i = 0; i < issuer_depth; i++) {
        inclusionProver.issuer_siblings[i] <== issuer_siblings[i];
    }
    // No wiring needed for indices

    component logicChecker = BusinessLogicChecker();
    // Wire inputs/outputs for logicChecker (same as before)
    logicChecker.area_threshold <== area_threshold;
    logicChecker.district_expected <== district_expected;
    logicChecker.reveal_flag <== reveal_flag;
    logicChecker.area_m2 <== area_m2;
    logicChecker.district_id <== district_id;
    logicChecker.right_type <== right_type;
    disclosed_right_type <== logicChecker.disclosed_right_type;
}

// === Main Component Instantiation ===
component main {
    public [ // List the INPUT signals of MonoCircuit that are PUBLIC
        ownership_root, schema_root, issuer_root,
        owner_commitment_public, area_threshold,
        district_expected, reveal_flag
        // disclosed_right_type is an OUTPUT, automatically public
    ]
} = MonoCircuit(16, 16, 16);