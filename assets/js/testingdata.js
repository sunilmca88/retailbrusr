$(document).ready(function () {
    /**************** SETTING STATIC VALUES FOR TESTING STARTS HERE *****************/
    function startTesting(){
        $('#sanctndAmt').val("5000000");
        $('#prsntOutstdng').val("3000000");
        $('#accType').val("loan").change();
        $('#accScheme').val("HL").change();
        $('#valOfSecurity').val("6000000");
        $('#proposedROI').val("9").blur();
        $('#blncLoanTenure').val("240");
        $('#sanctLTV').val("60");
        $('#schmLTV').val("60");
        $('#prsntEMI').val("12000");
        $('#loanMorat').val("6");
        
        
        $('#borrowerName-1').val("Sunil Kumar Yadav");
        $('#latestInc-1').val("0").blur();
        $('#feb20Inc-1').val("60000").blur();
        $('#totalDeduction-1').val("12000");
        $('#foir-1').val("70");
        $('#blncPrdSnctnTrm-1').val("300");
        $('#borrowerType-1').val("sal").change();
    }
    startTesting();
    /**************** SETTING STATIC VALUES FOR TESTING ENDS HERE *******************/
});