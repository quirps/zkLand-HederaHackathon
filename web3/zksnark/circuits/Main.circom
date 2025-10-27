include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/merkle.circom";
include "circomlib/circuits/comparators.circom";

include "./InclusionProver.circom";
include "./BusinessLogicChecker.circom";

/*
 * Main circuit
 */
template MonoCircuit(
    ownership_depth, // 16 
    schema_depth,    // 8
    issuer_depth     // 8
) {
    
    // public inputs 
    signal public input ownership_root;
    signal public input schema_root;
    signal public input issuer_root;
    signal public input owner_commitment_public;
    signal public input area_threshold;
    signal public input district_expected;
    signal public input reveal_flag;

    //public output
    signal public output disclosed_right_type;
    
    //private input from ownership proof
    signal private input owner_secret; 
    
    // From inclusion prover
    signal private input parcel_id_hash;
    signal private input schema_hash;
    signal private input issuer_id_hash;
    signal private input ownership_merkle_path[ownership_depth];
    signal private input ownership_merkle_index[ownership_depth];
    signal private input schema_merkle_path[schema_depth];
    signal private input schema_merkle_index[schema_depth];
    signal private input issuer_merkle_path[issuer_depth];
    signal private input issuer_merkle_index[issuer_depth];
    
    // From business logic (these are also in inclusion)
    signal private input area_m2;
    signal private input district_id;
    signal private input right_type;
    
    
    // Instantiate Components

    // Prove user knows the secret
    
    component ownershipProver = Poseidon(1);
    ownershipProver.inputs[0] <== owner_secret;
    
    // Constrain the calculated commitment to the public one
    ownershipProver.out === owner_commitment_public;
    
    
    //Merkle inclusion constraints
    component inclusionProver = InclusionProver(ownership_depth, schema_depth, issuer_depth);
    
    //Tie wires together
    //public
    inclusionProver.ownership_root <== ownership_root;
    inclusionProver.schema_root <== schema_root;
    inclusionProver.issuer_root <== issuer_root;
    inclusionProver.owner_commitment_public <== owner_commitment_public;
    
    // private
    inclusionProver.parcel_id_hash <== parcel_id_hash;
    inclusionProver.area_m2 <== area_m2;
    inclusionProver.right_type <== right_type;
    inclusionProver.district_id <== district_id;
    inclusionProver.schema_hash <== schema_hash;
    inclusionProver.issuer_id_hash <== issuer_id_hash;
    
    //constraint for asserting ownership of credential inclusion
    for (var i = 0; i < ownership_depth; i++) {
        inclusionProver.ownership_merkle_path[i] <== ownership_merkle_path[i];
        inclusionProver.ownership_merkle_index[i] <== ownership_merkle_index[i];
    }
    //contraint for asserting schema inclusion
    for (var i = 0; i < schema_depth; i++) {
        inclusionProver.schema_merkle_path[i] <== schema_merkle_path[i];
        inclusionProver.schema_merkle_index[i] <== schema_merkle_index[i];
    }
    //constraint for asserting issuer inclusion
    for (var i = 0; i < issuer_depth; i++) {
        inclusionProver.issuer_merkle_path[i] <== issuer_merkle_path[i];
        inclusionProver.issuer_merkle_index[i] <== issuer_merkle_index[i];
    }
    
    
    //Information Agencies will be interested in checking from the owner
    component logicChecker = BusinessLogicChecker();
    
    // Tie in wires
    //public
    logicChecker.area_threshold <== area_threshold;
    logicChecker.district_expected <== district_expected;
    logicChecker.reveal_flag <== reveal_flag;
    
    // private
    logicChecker.area_m2 <== area_m2;
    logicChecker.district_id <== district_id;
    logicChecker.right_type <== right_type;
    
    // public out
    disclosed_right_type <== logicChecker.disclosed_right_type;
}

// === Main Component to be Compiled ===
// We instantiate our MonoCircuit with the concrete depths from the spec
component main {
    public [
        ownership_root, schema_root, issuer_root, 
        owner_commitment_public, area_threshold,
        district_expected, reveal_flag,
        disclosed_right_type
    ]
} = MonoCircuit(16, 8, 8);