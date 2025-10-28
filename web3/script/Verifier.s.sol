// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import { Groth16Verifier } from "../src/Verifier.sol";

contract VerifierDeploy is Script {
    Groth16Verifier public verifier;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        verifier = new Groth16Verifier();

        vm.stopBroadcast();
    }
}
