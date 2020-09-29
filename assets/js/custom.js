$(document).ready(function () {

    /******Variable Initialisation starts here******/
    window.accObj = {};
    var LTVObj = {};
    var resRepPeriod = 0;
    window.stressObj = {};
    window.salStressPercentageConsolidated = 0;
    window.othStressPercentageConsolidated = 0;
    var maxOfSchmSnctdLTV = 0;
   // var maxOfBlncTenureRetirementAge = 0;
    var resolutionFramework = [];
    var stressType = "";    
    var LTV = [];
    var sanctndAmt =  $('#sanctndAmt'),
        sanctLTV = $('#sanctLTV'),
        schmLTV = $('#schmLTV'),
        prsntOutstdng = $('#prsntOutstdng'),
        valOfSecurity = $('#valOfSecurity'),
        proposedROI = $('#proposedROI'),
        unsrvcdInt = $('#unsrvcdInt'),
        estIntMoratorium = 0,
        blncLoanTenure = $('#blncLoanTenure');
        //estimatedMoratoriumInt = 0;
        //blncPeriodRetirement = $('#blncPeriodRetirement');

    var loanOptions = {
        "Select":"",
        "Home Loan": "HL",
        "Top-up Loan": "TL",
        "Auto Loan": "AL",
        "Education Loan with Security": "ELWS",
        "Education Loan without Security": "ELWoS",
        "Mortgage Loan": "ML",
        "Personal Loan": "PL",
        "Loan against LIP": "LL",
        "Gold Loan": "GL"
    };
    var odOptions = {
        "Select":"",
        "Home Loan OD": "HLOD",
        "Mortgage Loan OD": "MLOD",
        "Personal Loan OD": "PLOD"
    };

    var noOfApplicantOpt = {
        "1":"1",
        "2":"2",
        "3":"3",
        "4":"4",
        "5":"5",
        "6":"6",
        "7":"7",
        "8":"8",
        "9":"9",
        "10":"10"
    };

    var sectorOptions = {
        "Select":"",
        "Entertainment": "ent",
        "Gems & Jewellery": "gem",
        "Tourism": "tou",
        "Hospitality": "hos",
        "Electronics": "ele",
        "Logistics": "log",
        "Metal": "met",
        "Automotive": "aut",
        "Other": "oth"
    };


    var isFRR = "" ; //for enabling and disabling borrower type dropdown
    var incomeSrc = ["Latest Sal/Rent/GMBR","Sal/Rent/GMBR of Feb 2020"];
    var $accType = $("#accType");
    var $accSchm = $("#accScheme");
    var $noOfApplicant = $("#noOfApplicant");
    /******Variable Initialisation ends here******/

    /******Default function Initialisation starts here******/
    $('[data-toggle="tooltip"]').tooltip(); //Initializing  tooltip
    //$('#popupModal').modal();
    /******Default function Initialisation ends here******/

    $accType.change(function () {        
        $noOfApplicant.removeAttr('disabled');
        $noOfApplicant.empty();
        var selectedAccType = $('option:selected', this).val();
        
        $accSchm.empty();
        $('#applicants').empty(); // reset  borrower/coapplicant div
        //$("#noOfApplicant").val("0"); // reset coapplicant dropdown to 0
        isFRR = ""; //to disable borrower type dropdown
        incomeSrc = ["Latest Sal/Rent/GMBR","Sal/Rent/GMBR of feb 2020"];
        if ("loan" === selectedAccType) {
            /********Updating Scheme Options Starts here**************/
            $.each(loanOptions, function (key, value) {
                $accSchm.append($("<option></option>")
                    .attr("value", value).text(key));
            });
            /********Updating Scheme Options Ends here**************/
            $accSchm.removeAttr("disabled");
            
            /********Updating No of Applicants Options Starts here**************/
            $.each(noOfApplicantOpt, function (key, value) {
                $noOfApplicant.append($("<option></option>")
                    .attr("value", value).text(key));
            });
            /********Updating No of Applicants Options Ends here**************/
            
            $('#unsrvcdInt').val("").attr('disabled', true);
            $('#sanctndAmt').removeAttr("disabled");
            $('#blncLoanTenure').removeAttr("disabled");
        } else if ("frr" === selectedAccType) {
            isFRR = "disabled";
            $accSchm.append($("<option></option>")
                .attr("value", "frr").text("FRR")
            );
            $accSchm.attr('disabled', true);

            /********Updating No of Applicants Options Starts here**************/
            $noOfApplicant.append($("<option></option>")
                .attr("value", "1").text("1")).attr('disabled',true);
            /********Updating No of Applicants Options Ends here**************/
            
            $('#unsrvcdInt').val("").attr('disabled', true);
            $('#sanctndAmt').val("").attr('disabled', true);
            $('#blncLoanTenure').val("").attr('disabled', true);
            incomeSrc =  ["Latest Rent", "Rent in Feb 2020"];
        } else if ("od" === selectedAccType) {
            //isOD= "";
            /********Updating Scheme Options Starts here**************/
            $.each(odOptions, function (key, value) {
                $accSchm.append($("<option></option>")
                    .attr("value", value).text(key));
            });
            /********Updating Scheme Options Ends here**************/
            $accSchm.removeAttr("disabled");
            
            /********Updating No of Applicants Options Starts here**************/
             $.each(noOfApplicantOpt, function (key, value) {
                $noOfApplicant.append($("<option></option>")
                    .attr("value", value).text(key));
            });
            /********Updating No of Applicants Options Ends here**************/

            $('#unsrvcdInt').removeAttr("disabled");
            $('#sanctndAmt').removeAttr("disabled");
            $('#blncLoanTenure').removeAttr("disabled");            
        } else {
            $accSchm.attr('disabled', true);
        }
        $noOfApplicant.val("1").change();
    });

    
    $noOfApplicant.change(function () {
        $('#applicants').empty(); // reset borrower/coapplicant div
        for (var i = 1; i <= $('option:selected', this).text(); i++) {

            var borrowerElem = 
            '<div class="jumbotron">'+
            '   <div>'+
            '       <h5 class="alert alert-dark text-center" role="alert">'+
            '           Applicant #'+ i + 'Details'+
            '       </h5>'+
            '   </div>'+
            '   <div class="row">'+
            '    <div class="col-sm-6">'+
            '       <label for="borrowerName-'+ i +'">'+
            '          Applicant Name'+
            '       </label>'+
            '       <input type="text" class="form-control" id="borrowerName-'+ i +'" placeholder="Enter Name">'+
            '   </div>'+
            '        <div class="col-sm-3"><label for="borrowerType-'+ i +'">Borrower Type</label>'+
            '          <select id="borrowerType-'+ i +'" class="form-control" '+isFRR+'>'+
            '            <option selected value="">Select</option>'+
            '            <option value="sal">Salaried</option>'+
            '            <option value="oth">Other Individual</option>'+
            '          </select>'+
            '        </div>'+
            '        <div class="col-sm-3"><label for="sector-'+ i +'">Sector</label>'+
            '          <select id="sector-'+ i +'" class="form-control" disabled>'+
            '            <option selected value="">Select</option>'+
            '          </select>'+
            '        </div>'+
            '      </div>'+
            '      <br />'+
            '      <div class="row">'+
            '        <div class="col-sm-3"><label id="lblIncomeLatest-'+ i +'" for="latestInc-'+ i +
            '                  ">'+incomeSrc[0]+'</label><input type="tel" class="form-control" id="latestInc-'+ i +
            '                  " placeholder="Enter Value"></div>'+
            '        <div class="col-sm-3"><label id="lblIncomeFeb20-'+ i +'" for="feb20Inc-'+ i +
            '                  ">'+incomeSrc[1]+'</label><input type="tel" class="form-control" id="feb20Inc-'+ i +
            '                  " placeholder="Enter Value"></div>'+
            '        <div class="col-sm-3">'+
            '          <label for="totalDeduction-'+ i +'">Total Deduction (Except Current EMI)</label>'+
            '          <input type="tel" class="form-control" id="totalDeduction-'+ i +'" placeholder="Enter Value" '+isFRR+'>'+
            '        </div>'+
            '        <div class="col-sm-3">'+
            '          <label for="foir-'+ i +'" data-toggle="tooltip" title="Based on income & schematic guidelines">'+
            '            Applicable FOIR <sup><span class="badge badge-warning">i</span></sup>'+
            '          </label>'+
            '          <input type="tel" class="form-control" id="foir-'+ i +'" placeholder="Enter Value" '+isFRR+'>'+
            '        </div>'+
            '      </div>'+
            '      <br/>'+
            '      <div class="row">'+
            '        <div class="col-sm-2">'+
            '          <label for="netProfitYr-'+ i +'">Net Profit Year</label>'+
            '          <select id="netProfitYr-'+ i +'" class="form-control" '+isFRR+'>'+
            '            <option selected value="">Select</option>'+
            '            <option value="yr1920">2019-2020</option>'+
            '            <option value="yr1819">2018-2019</option>'+
            '          </select>'+
            '        </div>'+
            '        <div class="col-sm-3">'+
            '          <label for="1819Profit-'+ i +'" data-toggle="tooltip" title="If net profit of FY 2019-20 not available">'+
            '            100% Net Profit of FY 2018-19 <sup><span class="badge badge-warning">i</span></sup>'+
            '          </label>'+
            '          <input type="tel" class="form-control" id="1819Profit-'+ i +'" placeholder="Enter Value" '+isFRR+'>'+
            '        </div>'+
            '        <div class="col-sm-4">'+
            '          <label for="blncPrdSnctnTrm-'+ i +'">'+
            '            Balance period as per sanction terms (in months)'+
            '          </label>'+
            '          <input type="tel" class="form-control" id="blncPrdSnctnTrm-'+ i +'" placeholder="Enter Value">'+
            '        </div>'+
            '        <div class="col-sm-3" style="text-align:center;">'+
            '          <label>Percentage Reduction in Salary</label>'+
            '          <br />'+
            '          <h3 class="badge badge-danger" style="font-size: x-large;" id="borrowerImpact-1s"></h3>'+
            '        </div>'+
            '      </div>'+
            '    </div>';
                
            

            // var borrowerElem = '<div class="jumbotron"><div ><h5 class="alert alert-dark text-center" role="alert">Applicant #'+ i + 
            // ' Details</h5></div><div class="row"><div class="col-sm-3"><label for="borrowerType-'+ i + '">Borrower Type</label>\
            //     <select id="borrowerType-'+ i + '" class="form-control" '+isFRR+'><option selected value="" disabled>Select</option><option value="sal">Salaried</option>\
            //       <option value="oth">Other Individual</option></select></div><div class="col-sm-3"><label id="lblIncomeLatest-'+i+'" for="latestInc-'+ i + 
            //       '">'+incomeSrc[0]+'</label><input type="tel" class="form-control" id="latestInc-'+ i + 
            //       '"  placeholder="Enter Value"></div><div class="col-sm-3"><label id="lblIncomeFeb20-'+i+'" for="feb20Inc-'+ i + 
            //       '">'+incomeSrc[1]+'</label><input type="tel" class="form-control" id="feb20Inc-'+ i + 
            //       '" placeholder="Enter Value"></div><div class="col-sm-3"><label for="totalDeduction-'+ i + 
            //       '">Total Deduction(Monthly)</label><input type="tel" class="form-control" id="totalDeduction-'+ i + 
            //       '" placeholder="Enter Value" '+isFRR+'></div></div><br/>\
            //       <div class="row"><div class="col-sm-4"><label id="lblfoir-'+i+'" for="foir-'+i+
            //       '" data-toggle="tooltip" title="FOIR applicable as per present scheme guidelines in consonance with income level">\
            //           FOIR <sup><span class="badge badge-warning">i</span></sup></label>\
            //         <input type="tel" class="form-control" id="foir-'+i+'" placeholder="Enter Value"'+isFRR+'>\
            //       </div><div class="col-sm-4"><label for="netProfitYr-'+i+'">Net Profit Year</label><select id="netProfitYr-'+i+
            //       '" class="form-control" '+isFRR+'><option selected value="" disabled>Select</option><option value="yr1920">2019-2020</option>\
            //       <option value="yr1819">2018-2019</option></select></div>\
            //       <div class="col-sm-4"><label for="1920Profit-'+i+'">100% Net Profit <span id="year"></span></label>\
            //         <input type="tel" class="form-control" id="1920Profit-'+i+'" placeholder="Enter Value" '+isFRR+'>\
            //       </div></div><br/>\
            //       <div class="row"><div class="col-sm-8"><label for="borrowerName-'+ i + '">Customer Name</label><input type="text" class="form-control" id="borrowerName-'+ i + 
            //       '" placeholder="Enter Name"></div><div class="col-sm-4"style="text-align:center;"><label>Percentage Reduction in Salary</label><br/>\
            //         <h3 class="badge badge-danger" style="font-size: x-large;" id="borrowerImpact-'+ i + 
            //     '"></h3></div></div></div>';
            $('#applicants').append(borrowerElem);
            $('#lblfoir-'+i).tooltip();
            $("label[for='1819Profit-"+i+"']").tooltip();
            $("label[for='foir-"+i+"']").tooltip();
            $("label[for='blncPrdSnctnTrm-"+i+"']").tooltip();            
            $('#lbl1819Profit-'+i).tooltip();
        }


        $( "input[id^='feb20Inc']" ).blur(function (){
            var elemIndex = $(this).attr('id').split('-')[1];
            console.log("Element Index : "+elemIndex);
            var stressValue = calculateStress($('#latestInc-'+elemIndex).val(), $(this).val());
            console.log(stressValue);
            $('#borrowerImpact-'+elemIndex).html(stressValue+'%');

        });


        $( "input[id^='latestInc']" ).blur(function (){
            var elemIndex = $(this).attr('id').split('-')[1];
            $('#feb20Inc-'+elemIndex).val("");
            $('#borrowerImpact-'+elemIndex).html("");
        });
        
        $("[id^='netProfitYr']" ).change(function () {
            var selectedYr = $('option:selected', this).val();
            if(selectedYr === 'yr1920')
                $('#year').text('of 2019-2020');
            else
                $('#year').text('of 2018-2019');
            console.log($('option:selected', this).val());
        });
            
        $("[id^='borrowerType']" ).change(function () {
            var elemIndex = $(this).attr('id').split('-')[1];
            var selectedBorrowerType = $('option:selected', this).val();
            console.log(elemIndex);
            console.log(selectedBorrowerType);
            $("#sector-"+elemIndex).empty();
            
            if(selectedBorrowerType === "sal"){
                $('#lblIncomeLatest-'+elemIndex).text("Latest Salary");
                $('#lblIncomeFeb20-'+elemIndex).text("Salary in Feb 2020");
                $('#1920Profit-'+elemIndex).val("").attr('disabled', true);
                $('#netProfitYr-'+elemIndex).val("").attr('disabled', true);
                $('#sector-'+elemIndex).val("").attr('disabled', true);
                $("#sector-"+elemIndex).append($("<option></option>")
                        .attr("value", "").text("Select"));
            }else  if(selectedBorrowerType === "oth"){
                $.each(sectorOptions, function (key, value) {
                    $("#sector-"+elemIndex).append($("<option></option>")
                        .attr("value", value).text(key));
                });
                $('#sector-'+elemIndex).removeAttr('disabled');

                $('#lblIncomeLatest-'+elemIndex).text("Latest GMBR");
                $('#lblIncomeFeb20-'+elemIndex).text("Previous GMBR");
                $('#1920Profit-'+elemIndex).val("").removeAttr('disabled')
                $('#netProfitYr-'+elemIndex).val("").removeAttr('disabled')
            }else{
                $('#lblIncomeLatest-'+elemIndex).text("");
                $('#lblIncomeFeb20-'+elemIndex).text("");
            }
        });
    });
    function calculateStress(latestInc, feb20Inc){
        console.log(latestInc +"\n"+ feb20Inc);
        console.log(feb20Inc-latestInc);
        console.log(feb20Inc-latestInc > 0);
        if(feb20Inc-latestInc >= 0){
            console.log("Calculated Stress: "+ parseFloat((((feb20Inc-latestInc)/feb20Inc)*100).toFixed(2)));
            return parseFloat((((feb20Inc-latestInc)/feb20Inc)*100).toFixed(2));
        }else{
            alert("Wrong data");
            return 0;
        }
       

    };

    /*******Account level object creation starts here********/
    var accSchmSelectedVal = "";
    function createAccObject(){
        accObj = {};
        console.log("Inside Create Acc Object Function : "+$accType.val());
        var accType = $accType.val(),            
            accNo = $('#accNo').val().trim();
        accSchmSelectedVal = $accSchm.val();
        console.log("SKYYYYYYYYY  accSchmSelectedVal = $accSchm.val(); :"+  accSchmSelectedVal);
        if(accType == null || accType == ""){
            alert("Error! Please select account type");
        }else{
            accObj.accType =  accType;
        }
        
        if(accSchmSelectedVal == "" || accSchmSelectedVal == null){
            alert("Error! Please select account scheme");
        }else{
            accObj.scheme =  accSchmSelectedVal;
        }
        
        if(accNo == "" || accNo.length != 14){
            alert("Invalid Account Number")
        }else{
            accObj.accNo = accNo;
        }
        accObj.AppNo = $noOfApplicant.val();
        accObj.sanctndAmt = sanctndAmt.val().trim();
        accObj.sanctLTV = sanctLTV.val().trim();
        accObj.schmLTV = schmLTV.val().trim();
        accObj.prsntOutstdng = prsntOutstdng.val().trim();
        accObj.valOfSecurity = valOfSecurity.val().trim();
        accObj.proposedROI = proposedROI.val().trim();
        accObj.unsrvcdInt = unsrvcdInt.val().trim();
        accObj.estIntMoratorium = estIntMoratorium;
        accObj.blncLoanTenure = blncLoanTenure.val().trim();
        //accObj.blncPeriodRetirement = blncPeriodRetirement.val().trim();
        console.log("Account Level Object : "+ JSON.stringify(accObj));

    };
    /*******Account level object creation ends here********/
   // LTV Object : {"case1":33.333,"case2":66.667,"case3":333333.574,"case4":666666.907,"case5":666666.907}
    function calculateLTV(){
       
        LTVObj = {};
        // console.log("prsntOutstdng.val().trim() :"+prsntOutstdng.val().trim());
        // console.log("(prsntOutstdng.val().trim()+estIntMoratorium) : "+(prsntOutstdng.val().trim()+estIntMoratorium));
        // console.log("valOfSecurity.val().trim() : "+ valOfSecurity.val().trim());
        // console.log("((prsntOutstdng.val().trim()+estIntMoratorium)/valOfSecurity.val().trim()) : "+ parseFloat(((prsntOutstdng.val().trim()+estIntMoratorium))/parseFloat(valOfSecurity.val().trim())));
        // console.log("parseFloat(((prsntOutstdng.val().trim()+estIntMoratorium)/valOfSecurity.val().trim()) : " + parseFloat(((prsntOutstdng.val().trim()+estIntMoratorium)/valOfSecurity.val().trim())));
        // console.log("parseFloat(((prsntOutstdng.val().trim()+estIntMoratorium)/valOfSecurity.val().trim()).toFixed(5))*100 : "+ parseFloat(((prsntOutstdng.val().trim()+estIntMoratorium))/parseFloat(valOfSecurity.val().trim())));

        LTVObj.case1 = parseFloat((Number(prsntOutstdng.val().trim())*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case2 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(unsrvcdInt.val().trim()))*100/valOfSecurity.val().trim()).toFixed(5));
        LTVObj.case3 = parseFloat(((Number(prsntOutstdng.val().trim()) + Number(estIntMoratorium))*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case4 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(estIntMoratorium))*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case5 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(estIntMoratorium) + Number(unsrvcdInt.val().trim()))*100/valOfSecurity.val().trim()).toFixed(5));
        console.log("LTV Object : "+ JSON.stringify(LTVObj));


        calculateMaxResRepPeriod();
    }
    // var salariedLatestInc = 0,
    //     salariedFeb20Inc = 0,
    //     otherLatestInc = 0,
    //     otherFeb20Inc = 0;
   
    function calculateConsolidatedIncome(accType){
        var consolidatedCaseType = "";
        salStressPercentageConsolidated = 0;
        othStressPercentageConsolidated = 0;
        var salariedLatestInc = 0,
            salariedFeb20Inc = 0,
            otherLatestInc = 0,
            otherFeb20Inc = 0,
            noOfApplicant = $noOfApplicant.val();

        for(i=1; i<=noOfApplicant; i++){
            if($('#borrowerType-'+i).val() === "sal"){
                console.log("Latest Salary : "+ $('#latestInc-'+i).val().trim());
                salariedLatestInc += parseFloat($('#latestInc-'+i).val().trim());
                console.log("i:------> "+salariedLatestInc);
                salariedFeb20Inc += parseFloat($('#feb20Inc-'+i).val().trim());
                console.log("i:------> "+salariedFeb20Inc);
            }
            if($('#borrowerType-'+i).val() === "oth"){
                otherLatestInc += parseFloat($('#latestInc-'+i).val().trim());
                otherFeb20Inc += parseFloat($('#feb20Inc-'+i).val().trim());
            }
        }
        salStressPercentageConsolidated = calculateStress(salariedLatestInc, salariedFeb20Inc) || 0;
        othStressPercentageConsolidated = calculateStress(otherLatestInc, otherFeb20Inc) || 0;
        console.log("salStressPercentageConsolidated: "+salStressPercentageConsolidated);
        console.log("othStressPercentageConsolidated: "+ othStressPercentageConsolidated);

        if(salStressPercentageConsolidated === 0){
            if(othStressPercentageConsolidated < 50 && othStressPercentageConsolidated > 0){
                consolidatedCaseType = "case-7";
                resolutionFramework = ["NA"];
                stressType = "Minimum Stress";
            }
            if(othStressPercentageConsolidated>= 50 && othStressPercentageConsolidated <100){
                consolidatedCaseType = "case-8";
                if(accType === "loan")
                    resolutionFramework = ["R1","R2"];
                if(accType === "od")
                    resolutionFramework = ["F1"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                stressType = "Mild Stress";
                
            }
            if(othStressPercentageConsolidated === 100){
                consolidatedCaseType = "case-9";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;
                stressType = "Severe Stress";
            }

        }else if(salStressPercentageConsolidated <= 25 && salStressPercentageConsolidated > 0){
            if(othStressPercentageConsolidated === 0){
                consolidatedCaseType = "case-1";
                resolutionFramework = ["NA"];
                stressType = "Minimum Stress";
            }else if(othStressPercentageConsolidated < 50 && othStressPercentageConsolidated > 0){
                consolidatedCaseType = "case-1_7";
                resolutionFramework = ["NA"];
                stressType = "Minimum Stress";
            }
            if(othStressPercentageConsolidated>= 50 && othStressPercentageConsolidated <100){
                consolidatedCaseType = "case-8";
                if(accType === "loan")
                    resolutionFramework = ["R1","R2"];
                if(accType === "od")
                    resolutionFramework = ["F1"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                stressType = "Mild Stress";
            }
            if(othStressPercentageConsolidated === 100){
                consolidatedCaseType = "case-9";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;  
                stressType = "Severe Stress";
            }
         
        }else if(salStressPercentageConsolidated > 25 && salStressPercentageConsolidated <= 40){

            if(othStressPercentageConsolidated < 50 || othStressPercentageConsolidated === 0){
                consolidatedCaseType = "case-2";
                if(accType === "loan")
                    resolutionFramework = ["R1","R2"];
                if(accType === "od")
                    resolutionFramework = ["F1"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                stressType = "Mild Stress";
            }
            if(othStressPercentageConsolidated>= 50 && othStressPercentageConsolidated <100){
                consolidatedCaseType = "case-2_8";
                if(accType === "loan")
                    resolutionFramework = ["R1","R2"];
                if(accType === "od")
                    resolutionFramework = ["F1"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                stressType = "Mild Stress";
            }
            if(othStressPercentageConsolidated === 100){
                consolidatedCaseType = "case-9";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0; 
                stressType = "Severe Stress";
            }
        }else if(salStressPercentageConsolidated > 40 && salStressPercentageConsolidated < 100){
            
            if(othStressPercentageConsolidated < 50  || 
                othStressPercentageConsolidated === 0 ||
                (othStressPercentageConsolidated>= 50 && othStressPercentageConsolidated <100)){
                    consolidatedCaseType = "case-3";
                    if(accType === "loan")
                        resolutionFramework = ["R1","R2","M1","M2","M1R1","M1R2","M2R1","M2R2"];
                    if(accType === "od")
                        resolutionFramework = ["F1","F2","F1F2"];  
                    if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                        LTV[0] = LTVObj.case1;
                    // else
                    //     LTV[0] = 0;
                    if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                        LTV[1] = LTVObj.case3;
                    // else
                    //     LTV[1] = 0;           
                    stressType = "Severe Stress";
            }
            if(othStressPercentageConsolidated === 100){
                consolidatedCaseType = "case-9";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;    
                stressType = "Severe Stress";
            }
        }else if(salStressPercentageConsolidated === 100){
            if(othStressPercentageConsolidated === 0){
                consolidatedCaseType = "case-10";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;    
                stressType = "Severe Stress";
            }
            if(othStressPercentageConsolidated === 100){
                consolidatedCaseType = "case-9_10";
                if(accType === "loan")
                    resolutionFramework = ["M2","M2R1","M2R2"];
                if(accType === "od")
                    resolutionFramework = ["F2","F1F2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;    
                stressType = "Severe Stress";
            }

        }else{
            alert("Some error in calculateConsolidatedIncome method");
        }

        stressObj.stressPercentage = {
                "salStressPercentageConsolidated": salStressPercentageConsolidated,
                "othStressPercentageConsolidated": othStressPercentageConsolidated
            }
        //stressObj.acctype = "loan_od";
        stressObj.case = consolidatedCaseType;
        stressObj.stressType = stressType;
        stressObj.LTV = LTV;
        stressObj.resolutionFramework = resolutionFramework; 
        stressObj.acctype = accType;
        console.log("stressObj for Loan and OD : "+ JSON.stringify(stressObj));

        

    }
    
    function monthlyIntCalc(annualInterest){
        annualInterest = annualInterest * .01;
        console.log(Math.pow(parseFloat((1+parseFloat(annualInterest))), parseFloat((1/12)))-1);
    }


    $( "#proposedROI" ).blur(function (){
       // alert("test");
        var proposedROI = $(this).val().trim();
        var presentOutstanding = $('#prsntOutstdng').val().trim();
        if( proposedROI <= 0 || 
            presentOutstanding <= 0 ||
            !$.isNumeric(proposedROI) ||
            !$.isNumeric(presentOutstanding)){
                alert("Error in Estimated interest during moratorium calculation. Please enter proper values for Present Outstanding and Proposed ROI");
        }else{
            // $('#estIntMoratorium').val(
                estIntMoratorium =  parseFloat(presentOutstanding * 
                                        (Math.pow(parseFloat((1 + parseFloat(proposedROI * .01))), parseFloat((1/12)))-1)
                                      ).toFixed(3)
            // );
        }

    });

    
    /** 
    *
    * @param rate_per_period       The interest rate for the loan.
    * @param number_of_payments    The total number of payments for the loan in months.
    * @param present_value         The present value, or the total amount that a series of future payments is worth now;
    *                              Also known as the principal.
    * @param future_value          The future value, or a cash balance you want to attain after the last payment is made.
    *                              If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
    * @param type                  Optional, defaults to 0. The number 0 (zero) or 1 and indicates when payments are due.
    *                              0 = At the end of period
    *                              1 = At the beginning of the period
    * @returns {number}
    */
    function pmt(rate_per_period, number_of_payments, present_value, future_value, type){
        future_value = typeof future_value !== 'undefined' ? future_value : 0;
        type = typeof type !== 'undefined' ? type : 0;

        if(rate_per_period != 0.0){
            // Interest rate exists
            var q = Math.pow(1 + rate_per_period, number_of_payments);
            return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

        } else if(number_of_payments != 0.0){
            // No interest rate, but number of payments exists
            return -(future_value + present_value) / number_of_payments;
        }
        return 0;
    }

    // This function is from David Goodman's Javascript Bible.
    function conv_number(expr, decplaces) {
        var str = "" + Math.round(eval(expr) * Math.pow(10,decplaces));
        while (str.length <= decplaces) {
        str = "0" + str;
        }
    
        var decpoint = str.length - decplaces;
        return (str.substring(0,decpoint) + "." + str.substring(decpoint,str.length));
    }
    
    // Parameters are rate, total number of periods, payment made each period and future value
    function pv(rate, nper, pmt, fv) {
        rate = parseFloat(rate);
        nper = parseFloat(nper);
        pmt = parseFloat(pmt);
        fv = parseFloat(fv);
        if ( nper == 0 ) {
        alert("Why do you want to test me with zeros?");
        return(0);       
        }
        if ( rate == 0 ) { // Interest rate is 0
        pv_value = -(fv + (pmt * nper));
        } else {
        x = Math.pow(1 + rate, -nper); 
        y = Math.pow(1 + rate, nper);
        pv_value = - ( x * ( fv * rate - pmt + y * pmt )) / rate;
        }
        pv_value = conv_number(pv_value,2);
        return (pv_value);
    }
    
    function fv(rate, nper, pmt, pv) {
        rate = parseFloat(rate);
        nper = parseFloat(nper);
        pmt = parseFloat(pmt);
        pv = parseFloat(pv);
        if ( nper == 0 ) {
        alert("Why do you want to test me with zeros?");
        return(0);
        }
        if ( rate == 0 ) { // Interest rate is 0
        fv_value = -(pv + (pmt * nper));
        } else {
        x = Math.pow(1 + rate, nper);
        fv_value = - ( -pmt + x * pmt + rate * x * pv ) /rate;
        }
        fv_value = conv_number(fv_value,2);
        return (fv_value);
    }

    function calculateFOIR(){

    }


    console.log("accSchmSelectedVal before calculateMaxResRepPeriod() function: "+ accSchmSelectedVal);
    //Calculator 3
    function calculateMaxResRepPeriod(){
        var $allApplicantBlncPeriod = $( "input[id^='blncPrdSnctnTrm-']" );

        var arr = [];
        $.each($allApplicantBlncPeriod , function(i, item) {  //i=index, item=element in array
            console.log("Testing: allApplicantBlncPeriod : "+ $(item).val());
            arr[i] = $(item).val();
        });
        var minimumOfApplicantBlncPeriod = Math.min.apply(Math, arr);

        if(accSchmSelectedVal === "MLOD"){
            resRepPeriod = Math.min(144, minimumOfApplicantBlncPeriod);
        }else{
            resRepPeriod = Math.max(Number(blncLoanTenure.val().trim()), Number(minimumOfApplicantBlncPeriod));
            if(resRepPeriod > 180)
                resRepPeriod = resRepPeriod;
        }

        console.log("resRepPeriod  Inside: "+ resRepPeriod);
    }

    console.log("resRepPeriod  Outside: "+ resRepPeriod);

    //Calculator 4
    function calculateMaxExtension(){
        
    }

    //function 
    /****************Calculations Starts Here*************** */
    $('#btnCalculate').click(function(){
        var accountType = $accType.val(); 
        stressObj = {}; //resetting global variable
        resolutionFramework = []; //resetting global variable
        stressType = ""; //resetting global variable
        LTV = [];
        createAccObject(); //To Create Account level object
        calculateLTV(); //To Calculate LTV for all scenario

        maxOfSchmSnctdLTV = parseFloat(Math.max(sanctLTV.val().trim(), schmLTV.val().trim())).toFixed(2);
       // maxOfBlncTenureRetirementAge = parseInt(Math.max(blncLoanTenure.val().trim(), blncPeriodRetirement.val().trim()), 10);
            
        if(accountType  === "frr"){
            var stressPercentageFRR = calculateStress($('#latestInc-1').val().trim(), $('#feb20Inc-1').val().trim()) || 0;
            //var caseType = "";
            console.log("maxOfSchmSnctdLTV : "+maxOfSchmSnctdLTV);
           // console.log("maxOfBlncTenureRetirementAge : "+maxOfBlncTenureRetirementAge);
            if(stressPercentageFRR <= 25 || stressPercentageFRR === 0){
                stressObj.case = "case-4";
                stressObj.resolutionFramework = ["NA"];
                stressObj.stressType = "Minimum Stress";
            }else if(stressPercentageFRR > 25 && stressPercentageFRR <= 40){
                stressObj.case = "case-5";
                stressObj.resolutionFramework = ["R1","R2"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                stressObj.stressType = "Mild Stress";
            }else if(stressPercentageFRR > 40 && stressPercentageFRR < 100){
                stressObj.case = "case-6";
                stressObj.resolutionFramework = ["R1","R2","M1","M2","M1R1","M1R2","M2R1","M2R2"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                // else
                //     LTV[0] = 0;
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                //     LTV[1] = 0;                
                stressObj.stressType = "Severe Stress";
            }else if(stressPercentageFRR == 100){
                stressObj.case = "case-11";
                stressObj.resolutionFramework = ["M2","M2R1","M2R2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;           
                stressType = "Severe Stress";
            }else{
                stressObj.case = "nocase";
                stressObj.stressType.resolutionFramework = ["NA"];
            }
            console.log(LTV);
            stressObj.stressPercentage = stressPercentageFRR;
            stressObj.acctype = "frr";            
            stressObj.LTV = LTV;
           // stressObj.case = caseType;
           // stressObj.stressType = stressType;
           // stressObj.resolutionFramework = resolutionFramework; 
            console.log("stressObj : "+ JSON.stringify(stressObj));

            //console.log("JSON Parse : "+JSON.parse(stressObj));
        }else if(accountType  === "loan"){
            calculateConsolidatedIncome("loan");
           
        }else if(accountType  === "od"){
            calculateConsolidatedIncome("od");
        }else{
            
            console.log("Account Type None");
        }
    });
    
    /****************Calculations Ends Here*************** */
});