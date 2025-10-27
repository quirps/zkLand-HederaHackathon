pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/merkle.circom";

// We have 3 merkle trees to look after
// 1. ownership merkle tree : Leafs contain 
template InclusionProver(ownership_depth, schema_depth, issuer_depth) {
    // === 1. Inputs ===
        // Enables proving owner of credential 
        signal input ownership_root;
        // Enables proving inclusion of valid schema 
        signal input schema_root;
        // Enables proving inclusion of valid issuer
        signal input issuer_root;
        
        signal input owner_commitment_public;

    // Credential private data
        signal input parcel_id_hash;
        signal input area_m2;
        signal input right_type;
        signal input district_id;
        signal input schema_hash;
        signal input issuer_id_hash;
    // Proof inputs
        signal input ownership_merkle_path[ownership_depth];
        signal input ownership_merkle_index[ownership_depth];
        signal input schema_merkle_path[schema_depth];
        signal input schema_merkle_index[schema_depth];
        signal input issuer_merkle_path[issuer_depth];
        signal input issuer_merkle_index[issuer_depth];

    //2. Derived Data

    // Leaf Hash
    component leafHasher = Poseidon(7);
    leafHasher.inputs[0] <== parcel_id_hash;
    leafHasher.inputs[1] <== owner_commitment_public;
    leafHasher.inputs[2] <== area_m2;
    leafHasher.inputs[3] <== right_type;
    leafHasher.inputs[4] <== district_id;
    leafHasher.inputs[5] <== schema_hash;
    leafHasher.inputs[6] <== issuer_id_hash;

    signal leaf;
    leaf <== leafHasher.out;
    // Assert ownership chekcer belongs to ownership merkle tree
    component ownershipChecker = MerkleTreeChecker(ownership_depth);
    ownershipChecker.leaf <== leaf;
    ownershipChecker.root <== ownership_root;
    for( var i =0; i < ownership_depth; i++){
        ownershipChecker.path_elements[i] <== ownership_merkle_path[i];
        ownershipChecker.path_indices[i] <== ownership_merkle_index[i];
    }
    // Assert schema checker leaf belongs to schema merkle tree
    component schemaChecker = MerkleTreeChecker(schema_depth);
    schemaChecker.leaf <== schema_hash;
    schemaChecker.root <== schema_root;
    for (var i = 0; i < schema_depth; i++) {
        schemaChecker.path_elements[i] <== schema_merkle_path[i];
        schemaChecker.path_indices[i] <== schema_merkle_index[i];
    }
    // Assert issuer checker leaf belongs to issuer merkle tree
    component issuerChecker = MerkleTreeChecker(issuer_depth);
    issuerChecker.leaf <== issuer_id_hash;
    issuerChecker.root <== issuer_root;
    for (var i = 0; i < issuer_depth; i++) {
        issuerChecker.path_elements[i] <== issuer_merkle_path[i];
        issuerChecker.path_indices[i] <== issuer_merkle_index[i];
    }

    
        }

