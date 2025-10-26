pragma circom 2.0.0;

// This assumes circomlib is installed (e.g., in node_modules)
include "circomlib/circuits/poseidon2.circom";

/*
 * @title ProveOwnership
 * @dev A simple circuit to prove knowledge of a secret 'S' 
 * that hashes to a public commitment 'C'.
 * C = Poseidon(S)
 */
template ProveOwnership() {
    
    // === 1. Inputs ===

    // Private Input (witness)
    // This is the owner_secret 'S' provided by the prover.
    // It's a single field element.
    signal private input owner_secret;
    
    // Public Input
    // This is the owner_commitment_public 'C', which is known 
    // by the verifier (e.g., it's stored in the credential).
    signal public input owner_commitment_public;

    
    // === 2. Components ===
    
    // Instantiate the Poseidon hash function.
    // We are hashing exactly 1 input (the secret).
    component poseidonHasher = Poseidon2(1);
    

    // === 3. Constraints ===
    
    // Set the input for the hasher.
    // We wire our private 'owner_secret' to the hasher's input.
    poseidonHasher.inputs[0] <== owner_secret;
    
    // This is the core constraint.
    // It asserts that the output of Poseidon(owner_secret)
    // MUST be equal to the 'owner_commitment_public' input.
    // If they are not equal, the proof generation will fail.
    owner_commitment_public === poseidonHasher.out;
}

// To make this file runnable as a main circuit for testing
component main = ProveOwnership();