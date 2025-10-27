include "circomlib/circuits/comparators.circom";

// Constraints for businesses/authorities to check various data field of user's property
template BusinessLogicChecker() {
    //Agency request constraints
    signal public input area_threshold;
    signal public input district_expected;
    signal public input reveal_flag;
    //Private information being checked
    signal private input area_m2;
    signal private input district_id;
    signal private input right_type;
    
    signal public output disclosed_right_type;
    
    // Is user's land >= agency threshold requirement
    // areaCheck.out === 1 means this constraint is satisfied
    component areaCheck = GreaterEqThan(32);
    areaCheck.in[0] <== area_m2;
    areaCheck.in[1] <== area_threshold;
    areaCheck.out === 1;
    
    // Here we check if agency and user district ids match
    component isDistrictEqual = IsEqual();
    isDistrictEqual.in[0] <== district_id;
    isDistrictEqual.in[1] <== district_expected;
    
    // Next two parts check if the agency even wanted this information,
    // and if they do must match the disctrict id (monolothic circuit so 
    // we must have flags for seeking various information)
    component isCheckSkipped = IsZero();
    isCheckSkipped.in[0] <== district_expected;
    
    signal districtCheckValid;
    districtCheckValid <== isDistrictEqual.out + isCheckSkipped.out;
    
    component finalDistrictCheck = IsZero();
    finalDistrictCheck.in[0] <== districtCheckValid;
    finalDistrictCheck.out === 0;
    
    // Assert right type flag is binary, then match right type if 
    reveal_flag * (1 - reveal_flag) === 0;
    disclosed_right_type <== right_type * reveal_flag;
}

component BusinessLogicChecker {
    public [
        disclosed_right_type
    ]
} = BusinessLogicChecker();