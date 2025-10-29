pragma circom 2.0.0;

include "../../../../node_modules/circomlib/circuits/smt/smtverifier.circom";

// Minimal wrapper around circomlib's SMTVerifier
template MinimalSMTVerifier(nLevels) {
    // Public inputs (witness builder will set these)
    signal input enabled;            // 1 to enable check
    signal input root;               // root of SMT
    signal input siblings[nLevels];  // siblings, level 0..nLevels-1
    signal input oldKey;
    signal input oldValue;
    signal input isOld0;
    signal input key;                // the leaf 'key' used by SMTHash1 in circomlib
    signal input value;              // leaf value
    signal input fnc;                // function selector for the verifier (e.g., 0 = inclusion)

    // instantiate the library verifier
    component v = SMTVerifier(nLevels);
    v.enabled <== enabled;
    v.root <== root;
    v.oldKey <== oldKey;
    v.oldValue <== oldValue;
    v.isOld0 <== isOld0;
    v.key <== key;
    v.value <== value;
    v.fnc <== fnc;
    for (var i = 0; i < nLevels; i++) {
        v.siblings[i] <== siblings[i];
    }

    // Expose an output for convenience. The SMTVerifier will impose constraints
    // during witness-generation; if they don't hold witness computation will fail.
    // We output a constant 1 so that main has an output to check.
    signal output ok;
    ok <== 1;
}

component main = MinimalSMTVerifier(10); // change 3 to your desired depth (nLevels)
