pragma circom 2.0.0;

template SimpleTest() {
    signal public input pubIn;
    signal private input privIn;
    signal output out;

    // Constraint: out = pubIn + privIn
    out <== pubIn + privIn;
}

// Instantiate main, declaring pubIn as the public input
component main { public [pubIn] } = SimpleTest();