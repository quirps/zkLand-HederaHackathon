pragma circom 2.0.0;

include "circomlib/circuits/poseidon2.circom";
include "circomlib/circuits/merkle.circom";
include "circomlib/circuits/comparators.circom";

// Local templates
include "OwnershipProof.circom";
include "inclusionProver.circom";
include "businessLogicChecker.circom";

template Main() {
    // === 1. Inputs ===
        // Enables proving owner of credential 
        signal private input ownership_root;
        // Enables proving inclusion of valid schema 
        signal private input schema_root;
        // Enables proving inclusion of valid issuer
        signal private input issuer_root;
        
        signal private input owner_commitment_public;

    // Credential data
        signal private input parcel_id_hash
        signal private input area_m2;
        signal private input right_type;
        signal private input district_id;
        signal private input schema_hash;
        signal private input issuer_id_hash;
    // Proof inputs
        
        }