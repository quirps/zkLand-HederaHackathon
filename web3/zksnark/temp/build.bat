@echo off
setlocal enabledelayedexpansion

echo ============================================
echo     Sparse Merkle Tree Circuit Builder
echo ============================================

set CIRCUIT=SMT
set CIRCUIT_DIR=circuits
set BUILD_DIR=build
set PTAU_DIR=tau
set PTAU_FILE=%PTAU_DIR%\pot12_final.ptau
set PHASE1_FILE=%PTAU_DIR%\pot12_0000.ptau
set PHASE2_FILE=%PTAU_DIR%\pot12_0001.ptau
set ZKEY_0=%BUILD_DIR%\%CIRCUIT%_0000.zkey
set ZKEY_FINAL=%BUILD_DIR%\%CIRCUIT%_final.zkey
set VK_JSON=%BUILD_DIR%\verification_key.json
set VERIFIER_SOL=%BUILD_DIR%\%CIRCUIT%Verifier.sol
set INPUT_FILE=input.json

:: ---------------------------------------------
:: [1] Compile the circuit
:: ---------------------------------------------
if exist "%BUILD_DIR%\%CIRCUIT%.r1cs" (
    echo [✓] Step 1 skipped: %BUILD_DIR%\%CIRCUIT%.r1cs already exists.
) else (
    echo [→] Compiling circuit...
    circom "%CIRCUIT_DIR%\%CIRCUIT%.circom" --r1cs --wasm --sym -o "%BUILD_DIR%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Circuit compilation failed!
        exit /b 1
    )
)

:: ---------------------------------------------
:: [2] Powers of Tau (only if not done)
:: ---------------------------------------------
if exist "%PTAU_FILE%" (
    echo [✓] Step 2 skipped: %PTAU_FILE% already exists.
) else (
    echo [→] Generating Powers of Tau...
    if not exist "%PTAU_DIR%" mkdir "%PTAU_DIR%"
    snarkjs powersoftau new bn128 14 "%PHASE1_FILE%" -v
    snarkjs powersoftau contribute "%PHASE1_FILE%" "%PHASE2_FILE%" --name="First contribution" -v
    snarkjs powersoftau prepare phase2 "%PHASE2_FILE%" "%PTAU_FILE%" -v --noDebug
    snarkjs powersoftau verify "%PTAU_FILE%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Powers of Tau failed!
        exit /b 1
    )
)

:: ---------------------------------------------
:: [3] Groth16 Setup
:: ---------------------------------------------
if exist "%ZKEY_0%" (
    echo [✓] Step 3 skipped: %ZKEY_0% already exists.
) else (
    echo [→] Running Groth16 setup...
    snarkjs groth16 setup "%BUILD_DIR%\%CIRCUIT%.r1cs" "%PTAU_FILE%" "%ZKEY_0%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Groth16 setup failed!
        exit /b 1
    )
)

:: ---------------------------------------------
:: [4] Contribute to ZKey
:: ---------------------------------------------
if exist "%ZKEY_FINAL%" (
    echo [✓] Step 4 skipped: %ZKEY_FINAL% already exists.
) else (
    echo [→] Contributing to ZKey...
    snarkjs zkey contribute "%ZKEY_0%" "%ZKEY_FINAL%" --name="1st Contributor" -v
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] ZKey contribution failed!
        exit /b 1
    )
)

:: ---------------------------------------------
:: [5] Export Verification Key
:: ---------------------------------------------
if exist "%VK_JSON%" (
    echo [✓] Step 5 skipped: %VK_JSON% already exists.
) else (
    echo [→] Exporting verification key...
    snarkjs zkey export verificationkey "%ZKEY_FINAL%" "%VK_JSON%"
)

:: ---------------------------------------------
:: [6] Export Solidity Verifier
:: ---------------------------------------------
if exist "%VERIFIER_SOL%" (
    echo [✓] Step 6 skipped: %VERIFIER_SOL% already exists.
) else (
    echo [→] Exporting Solidity verifier...
    snarkjs zkey export solidityverifier "%ZKEY_FINAL%" "%VERIFIER_SOL%"
)

:: ---------------------------------------------
:: [7] Generate Mock Data + Witness + Proof
:: ---------------------------------------------
if exist "%BUILD_DIR%\proof.json" (
    echo [✓] Step 7 skipped: proof already generated.
) else (
    echo [→] Generating mock data and witness...
    node generate_data.js

    if not exist "%INPUT_FILE%" (
        echo [ERROR] Missing %INPUT_FILE%! Make sure generate_data.js outputs it.
        exit /b 1
    )

    node "%BUILD_DIR%\smt_js\generate_witness.js" "%BUILD_DIR%\smt_js\smt.wasm" "%INPUT_FILE%" "%BUILD_DIR%\witness.wtns"
    snarkjs groth16 prove "%ZKEY_FINAL%" "%BUILD_DIR%\witness.wtns" "%BUILD_DIR%\proof.json" "%BUILD_DIR%\public.json"
    snarkjs groth16 verify "%VK_JSON%" "%BUILD_DIR%\public.json" "%BUILD_DIR%\proof.json"
)

echo ============================================
echo [✓] All steps completed successfully!
echo Outputs in: %BUILD_DIR%
echo ============================================

pause
