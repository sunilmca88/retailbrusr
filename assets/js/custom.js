'use strict';
$(document).ready(function () {
    
    /******Variable Initialisation starts here******/
    window.stressObj = {};
    var accObj = {},
        LTVObj = {},
        FOIRObj = {},
        //stressObj = {},
        resRepPeriod = 0,
        resolutionFramework = [],
        LTV = [],
        applicantsObj = [];

    window.salStressPercentageConsolidated = 0;
    window.othStressPercentageConsolidated = 0;
    var maxOfSchmSnctdLTV = 0;
    var stressType = "",
        additionalFOIR = 10,
        FOIRCap = 80,
        minFOIR = 50,
        estIntMoratorium = 0,
        blncLoanTenureValue =  0,
        accSchmSelectedVal = "";  

   // var maxOfBlncTenureRetirementAge = 0;
    
      

    var sanctndAmt =  $('#sanctndAmt'),
        sanctLTV = $('#sanctLTV'),
        schmLTV = $('#schmLTV'),
        prsntOutstdng = $('#prsntOutstdng'),
        valOfSecurity = $('#valOfSecurity'),
        proposedROI = $('#proposedROI'),
        unsrvcdInt = $('#unsrvcdInt');
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
        "Entertainment": "A_ent",
        "Gems & Jewellery": "A_gem",
        "Tourism": "A_tou",
        "Hospitality": "A_hos",
        "Electronics": "B_ele",
        "Logistics": "B_log",
        "Metal": "B_met",
        "Automotive": "B_aut",
        "Other": "C_oth"
    };


    var isFRR = "" ; //for enabling and disabling borrower type dropdown
    var incomeSrc = ["Latest Sal/Rent/GMBR","Sal/Rent/GMBR of Feb 2020"];
    var $accType = $("#accType");
    var $accSchm = $("#accScheme");
    var $noOfApplicant = $("#noOfApplicant"),
        selectedAccType = "";
    /******Variable Initialisation ends here******/

    /******Default function Initialisation starts here******/
    $('[data-toggle="tooltip"]').tooltip(); //Initializing  tooltip
    //$('#popupModal').modal();
    /******Default function Initialisation ends here******/


    

    $accType.change(function () {     
        $noOfApplicant.removeAttr('disabled');
        $noOfApplicant.empty();
        selectedAccType = $('option:selected', this).val();
        
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
           // $('#blncLoanTenure').removeAttr("disabled");
        } else if ("frr" === selectedAccType) {
            isFRR = "disabled";
            $accSchm.append($("<option></option>")
                .attr("value", "FRR").text("FRR")
            );
            $accSchm.attr('disabled', true);

            /********Updating No of Applicants Options Starts here**************/
            $noOfApplicant.append($("<option></option>")
                .attr("value", "1").text("1")).attr('disabled',true);
            /********Updating No of Applicants Options Ends here**************/
            
            $('#unsrvcdInt').val("").attr('disabled', true);
            $('#sanctndAmt').val("").attr('disabled', true);
          //  $('#blncLoanTenure').val("").attr('disabled', true);
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
           // $('#blncLoanTenure').removeAttr("disabled");            
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
            '           Applicant #'+ i + ' Details'+
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
            '        <div class="col-sm-3"><label id="lblIncomeLatest-'+ i +'" for="latestInc-'+ i +'">'
                            +incomeSrc[0]+'</label><input type="tel" class="form-control" id="latestInc-'+ i + '"'+
            '                  placeholder="Enter Value"></div>'+
            '        <div class="col-sm-3"><label id="lblIncomeFeb20-'+ i +'" for="feb20Inc-'+ i +'">'
                            +incomeSrc[1]+'</label><input type="tel" class="form-control" id="feb20Inc-'+ i + '"'+
            '                  placeholder="Enter Value"></div>'+
            '        <div class="col-sm-3">'+
            '          <label for="totalDeduction-'+ i +'">Total Deduction (Except Current EMI)</label>'+
            '          <input type="tel" class="form-control" id="totalDeduction-'+ i +'" placeholder="Enter Value" '+isFRR+'>'+
            '        </div>'+
            '        <div class="col-sm-3">'+
            '          <label for="foir-'+ i +'" data-toggle="tooltip" title="Based on income & schematic guidelines">'+
            '            Applicable FOIR <sup><span class="badge btn-bob">i</span></sup>'+
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
            '          <label for="netProfitVal-'+ i +'" data-toggle="tooltip" title="If net profit of FY 2019-20 not available">'+
            '            100% Net Profit <span id="year-'+ i +'"></span> <sup><span class="badge btn-bob">i</span></sup>'+
            '          </label>'+
            '          <input type="tel" class="form-control" id="netProfitVal-'+ i +'" placeholder="Enter Value" '+isFRR+'>'+
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
            '          <h3 class="badge badge-danger" style="font-size: x-large;" id="borrowerImpact-'+ i +'"></h3>'+
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
            $("label[for='netProfitVal-"+i+"']").tooltip();
            $("label[for='foir-"+i+"']").tooltip();
            $("label[for='blncPrdSnctnTrm-"+i+"']").tooltip();            
            $('#lblNetProfitVal-'+i).tooltip();
        }


        $( "input[id^='feb20Inc']" ).blur(function (){
            var elemIndex = $(this).attr('id').split('-')[1];
            console.log("Element Index : "+elemIndex);
            //var stressValue = calculateStress(Number($('#latestInc-'+elemIndex).val()), Number($(this).val()));
            console.log(calculateStress(Number($('#latestInc-'+elemIndex).val()), Number($(this).val())));
            $('#borrowerImpact-'+elemIndex).html(calculateStress(Number($('#latestInc-'+elemIndex).val()), Number($(this).val()))+'%');

        });


        $( "input[id^='latestInc']" ).blur(function (){
            var elemIndex = $(this).attr('id').split('-')[1];
            $('#feb20Inc-'+elemIndex).val("");
            $('#borrowerImpact-'+elemIndex).html("");
        });
        
        $("[id^='netProfitYr']" ).change(function () {
            var elemIndex = $(this).attr('id').split('-')[1];
            var selectedYr = $('option:selected', this).val();
            if(selectedYr === 'yr1920')
                $('#year-'+elemIndex).html('of FY 2019-20');
            else
                $('#year-'+elemIndex).html('of FY 2018-19');
            console.log($('option:selected', this).val() +"\n Index is: "+elemIndex);
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
                $('#netProfitVal-'+elemIndex).val("").attr('disabled', true);
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
                $('#netProfitVal-'+elemIndex).val("").removeAttr('disabled')
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
    
    function createAccObject(){
        accObj = {};
        console.log("Inside Create Acc Object Function : "+$accType.val());
        //var accType = $accType.val(),            
        var accNo = $('#accNo').val().trim(),
        accSchmSelectedVal = $accSchm.val();
        //console.log("SKYYYYYYYYY  accSchmSelectedVal = $accSchm.val(); :"+  accSchmSelectedVal);
        if(accType == null || accType == ""){
            alert("Error! Please select account type");
        }else{
            accObj.accType =  selectedAccType;
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
        
        accObj.sanctndAmt = sanctndAmt.val().trim();
        accObj.prsntOutstdng = prsntOutstdng.val().trim();
        accObj.valOfSecurity = valOfSecurity.val().trim();
        accObj.proposedROI = proposedROI.val().trim();
        accObj.estIntMoratorium = estIntMoratorium;
        accObj.blncLoanTenure = blncLoanTenureValue;
        accObj.sanctLTV = sanctLTV.val().trim();        
        accObj.schmLTV = schmLTV.val().trim();
        accObj.fitlRepTenure = $('#fitlRepTenure').val().trim();
        accObj.unsrvcdInt = unsrvcdInt.val().trim();
        accObj.prsntEMI = $('#prsntEMI').val().trim();
        accObj.fitlMorat = $('#fitlMorat').val().trim();
        accObj.loanMorat = $('#loanMorat').val().trim();
        accObj.AppNo = $noOfApplicant.val() || 0;
        
        //accObj.blncPeriodRetirement = blncPeriodRetirement.val().trim();
        console.log("Account Level Object : "+ JSON.stringify(accObj));

    };
    /*******Account level object creation ends here********/
   // LTV Object : {"case1":33.333,"case2":66.667,"case3":333333.574,"case4":666666.907,"case5":666666.907}
    function calculateLTV(){
       
        LTVObj = {};
        LTVObj.case1 = parseFloat((Number(prsntOutstdng.val().trim())*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case2 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(unsrvcdInt.val().trim()))*100/valOfSecurity.val().trim()).toFixed(5));
        LTVObj.case3 = parseFloat(((Number(prsntOutstdng.val().trim()) + Number(estIntMoratorium))*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case4 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(estIntMoratorium))*100/Number(valOfSecurity.val().trim())).toFixed(5));
        LTVObj.case5 = parseFloat(((Number(sanctndAmt.val().trim()) + Number(estIntMoratorium) + Number(unsrvcdInt.val().trim()))*100/valOfSecurity.val().trim()).toFixed(5));
        console.log("LTV Object : "+ JSON.stringify(LTVObj));


        calculateMaxResRepPeriod();
    }
   
    var combinedRepaymentCapacity_presentInc = 0,
        combinedRepaymentCapacity_futureInc = 0,
        combinedOutsideObligation_presentInc = 0,
        combinedOutsideObligation_futureInc = 0,
        maxEMI_presentInc = 0,
        maxEMI_futureInc = 0;
    // This function is used to assign case type to SALARIED individual borrower of a loan 
    // to faclitate in calculation of FOIR for everybody individually
    function getFOIROfSalIndividual(stressPercentage, latestInc, feb20Inc, maxFOIR, total_deduction){
        FOIRObj = {}
        
        //var maxFOIR = (Math.min((Number(applicable_foir)+10), FOIRCap /*declared globally and is set to 80 */))/100;
        //console.log("maxFOIR calculated is : "+ maxFOIR);
        console.log("SALARIED stressPercentage : "+stressPercentage +"\n latestInc: "+latestInc+"\n feb20Inc: "+feb20Inc);
            if(stressPercentage >= 0 && stressPercentage <= 25){
                console.log("CASE 1 OF SALARIED of getFOIROfSalIndividual");
                return {case_type: "case-1"};
            }else if(stressPercentage > 25 && stressPercentage <= 40){
                //return "case-2";
                console.log("CASE 2 OF SALARIED of getFOIROfSalIndividual");
                FOIRObj["upto24Month"] = latestInc;
                FOIRObj["after24Months"] = feb20Inc;
                FOIRObj["case_type"] = "case-2"
            }else if(stressPercentage > 40 && stressPercentage < 100){
                //return "case-3";
                FOIRObj["upto24Month"] = latestInc;
                FOIRObj["after24Months"] = feb20Inc;
                FOIRObj["case_type"] = "case-3"

            }else if(stressPercentage == 100){
                console.log("CASE 10 OF SALARIED of getFOIROfSalIndividual");
                FOIRObj["upto24Month"] = feb20Inc * .75;
                FOIRObj["after24Months"] = feb20Inc;
                FOIRObj["case_type"] = "case-10"
            }else{
                console.log("NO CASE OF SALARIED of getFOIROfSalIndividual");                
            }
            combinedRepaymentCapacity_presentInc += FOIRObj["upto24Month"];
            combinedOutsideObligation_presentInc += total_deduction;
            console.log("SALARIED Combined repayment capacity present Income: "+ combinedRepaymentCapacity_presentInc);
            console.log("SALARIED Combined repayment capacity future Income: "+ combinedRepaymentCapacity_futureInc);
            //console.log("TYPE OF FOIRObj['upto24Month'] : "+ typeof FOIRObj["upto24Month"]);
            FOIRObj["pre_max_monthly_payment"] = FOIRObj["upto24Month"] * maxFOIR;
            FOIRObj["pre_totalPermissibleDeduction"] = total_deduction;
            FOIRObj["pre_available_capacity"] = FOIRObj["pre_max_monthly_payment"] - total_deduction;
            maxEMI_presentInc += FOIRObj["pre_available_capacity"];
            //console.log("FOIRObj inside getFOIROfSalIndividual function : "+ JSON.stringify(FOIRObj));
            
            //Calculation of repayment capacity on FUTURE INCOME
            combinedRepaymentCapacity_futureInc  += FOIRObj["after24Months"];            
            combinedOutsideObligation_futureInc += total_deduction;
            console.log("SALARIED Combined repayment capacity future Income : "+ combinedRepaymentCapacity_futureInc);
            FOIRObj["future_max_monthly_payment"] = FOIRObj["after24Months"] * maxFOIR;
            FOIRObj["future_available_capacity"] = FOIRObj["future_max_monthly_payment"] - total_deduction;
            maxEMI_futureInc += FOIRObj["future_available_capacity"];
            
            return FOIRObj;
    }


    // This function is used to assign case type to SALARIED individual borrower of a loan 
    // to faclitate in calculation of FOIR for everybody individually
    function getFOIROfOthIndividual(stressPercentage, profitYr, profitval, maxFOIR, total_deduction){
        FOIRObj = {}
        if(stressPercentage >=0 && stressPercentage < 50){
            console.log("CASE 7 OF OTHER of getFOIROfOthIndividual");
            return {case_type: "case-7"};
        }else if(stressPercentage >= 50 && stressPercentage <= 100){
            //return "case-8";
            FOIRObj["case_type"] = "case-8_9"
            console.log("CASE 8 and 9 OF OTHER of getFOIROfOthIndividual");
            if(profitYr === "yr1920"){
                FOIRObj["upto24Month"] = (profitval/12) * .85;
                FOIRObj["after24Months"] = profitval/12;
            }else if(profitYr === "yr1819"){
                FOIRObj["upto24Month"] = (profitval/12) * .80;
                FOIRObj["after24Months"] = profitval/12;
            }else{
                console.log("NO CASE OF OTHER of getFOIROfSalIndividual");                
            }
            
        }

        //Calculation of repayment capacity on PRESENT INCOME
        combinedRepaymentCapacity_presentInc += FOIRObj["upto24Month"];
        combinedOutsideObligation_presentInc += total_deduction;
        console.log("SALARIED Combined repayment capacity present Income : "+ combinedRepaymentCapacity_presentInc);
        //console.log("TYPE OF FOIRObj['upto24Month'] : "+ typeof FOIRObj["upto24Month"]);
        FOIRObj["pre_max_monthly_payment"] = FOIRObj["upto24Month"] * maxFOIR;
        FOIRObj["pre_totalPermissibleDeduction"] = total_deduction;
        FOIRObj["pre_available_capacity"] = FOIRObj["pre_max_monthly_payment"] - total_deduction;        
        maxEMI_presentInc += FOIRObj["pre_available_capacity"];
        
        //Calculation of repayment capacity on FUTURE INCOME
        combinedRepaymentCapacity_futureInc  += FOIRObj["after24Months"];        
        combinedOutsideObligation_futureInc += total_deduction;
        console.log("SALARIED Combined repayment capacity future Income : "+ combinedRepaymentCapacity_futureInc);
        FOIRObj["future_max_monthly_payment"] = FOIRObj["after24Months"] * maxFOIR;
        FOIRObj["future_available_capacity"] = FOIRObj["future_max_monthly_payment"] - total_deduction;
        maxEMI_futureInc += FOIRObj["future_available_capacity"];
        //console.log("FOIRObj inside getFOIROfOthIndividual function: "+ JSON.stringify(FOIRObj));


        return FOIRObj;
        
    }


    window.sectorObj = [];
    function calculateConsolidatedIncome(accType){
        
        //applicantsObj = [];
        combinedRepaymentCapacity_presentInc= 0;
        combinedRepaymentCapacity_futureInc = 0;
        combinedOutsideObligation_futureInc = 0;
        combinedOutsideObligation_presentInc = 0;
        maxEMI_presentInc = 0;
        maxEMI_futureInc = 0;
        var consolidatedCaseType = "",
        salStressPercentageConsolidated = 0,
        othStressPercentageConsolidated = 0;
        var salariedLatestInc = 0,
            salariedFeb20Inc = 0,
            otherLatestInc = 0,
            otherFeb20Inc = 0,
            noOfApplicant = $noOfApplicant.val();
        //var applicantsObj = []
        for(var i=1; i<=noOfApplicant; i++){

            //FOIRObj = [];
            var tempLatestInc = Number($('#latestInc-'+i).val().trim()) || 0;
            var tempFeb20Inc = Number($('#feb20Inc-'+i).val().trim()) || 0;
            var tempBrwrType = $('#borrowerType-'+i).val() || "";

            var tempName = $('#borrowerName-'+i).val().trim();
            var tempTotDeduction = Number($('#totalDeduction-'+i).val().trim());
            var tempFOIRApplicable = $('#foir-'+i).val().trim();
            var tempBlncPrdSnctnTrm = Number($('#blncPrdSnctnTrm-'+i).val().trim());
            var tempBrwrImpact = $('#borrowerImpact-'+i).html();
            var maxFOIR = 0;
            //var applicableCaseOnBrwr = getCaseTypeOfBrwr(Number(tempBrwrImpact.split('%')[0]), tempBrwrType);
            
            if(tempBrwrType === "sal"){
                maxFOIR = (Math.min((Number(tempFOIRApplicable)+10), FOIRCap /*declared globally and is set to 80 */))/100;
                console.log("maxFOIR calculated in SALARIED SECTION IS is : "+ maxFOIR);
                var tempFOIRSal = getFOIROfSalIndividual(
                                    /* @param borrower salary impact */     Number(tempBrwrImpact.split('%')[0]), 
                                    /* @param latest salary */              tempLatestInc, 
                                    /* @param february 2020 salary*/        tempFeb20Inc,
                                    /* @param max FOIR calculated*/         maxFOIR,
                                    /* @param total deudction entered */    tempTotDeduction
                                );
                console.log("Inside Consolidated SALARIED part and printing FOIR : "+tempFOIRSal);
                applicantsObj[i-1] = {
                    name: tempName,
                    borrowerType: tempBrwrType, 
                    latestInc: tempLatestInc,
                    feb20Inc: tempFeb20Inc,
                    foir: tempFOIRSal,
                    blncPrdSnctnTrm: tempBlncPrdSnctnTrm,
                    impact: tempBrwrImpact
                    //caseType: applicableCaseOnBrwr,
                }
                sectorObj[i-1] = "D_na";
                console.log("Latest Salary : "+ tempLatestInc);
                salariedLatestInc += parseFloat(tempLatestInc);
                console.log("i:------> "+salariedLatestInc);
                salariedFeb20Inc += parseFloat(tempFeb20Inc);
                console.log("i:------> "+salariedFeb20Inc);
            }
            if(tempBrwrType === "oth"){    
                maxFOIR = (Math.min((Number(tempFOIRApplicable)+10), FOIRCap /*declared globally and is set to 80 */))/100;
                console.log("maxFOIR calculated in OTHER SECTION IS is : "+ maxFOIR);
                var tempSector = $('#sector-'+i).val();
                var tempNetProfitYr = $('#netProfitYr-'+i).val();
                var tempNetProfitVal = Number($('#netProfitVal-'+i).val());
                var tempFOIROth = getFOIROfOthIndividual(
                                    /* @param borrower salary impact */     Number(tempBrwrImpact.split('%')[0]), 
                                    /* @param Year of Net Profit */         tempNetProfitYr, 
                                    /* @param Net profit value */           tempNetProfitVal,
                                    /* @param applicable FOIR entered*/     maxFOIR,
                                    /* @param total deudction entered */    tempTotDeduction
                                );
                console.log("Inside Consolidated OTHER part and printing FOIR : "+tempFOIROth);
                applicantsObj[i-1] = {
                    name: tempName,
                    borrowerType: tempBrwrType,
                    sector : tempSector,
                    latestInc: tempLatestInc,
                    feb20Inc: tempFeb20Inc,
                    totalDeduction: tempTotDeduction,
                    foir: tempFOIROth,
                    profitYr : tempNetProfitYr,
                    profit :  tempNetProfitVal,
                    blncPrdSnctnTrm: tempBlncPrdSnctnTrm,
                    impact: tempBrwrImpact,
                   // caseType: applicableCaseOnBrwr
                }
                
                sectorObj[i-1] = tempSector;
                otherLatestInc += parseFloat(tempLatestInc);
                otherFeb20Inc += parseFloat(tempFeb20Inc);
            }
        }

        console.log("COMBINED REPAYMENT CAPACITY : "+ combinedRepaymentCapacity_presentInc);
        stressObj.repaymentOnPresentIncome = {
            combinedRepaymentCapacity_presentInc : combinedRepaymentCapacity_presentInc || 0,
            combinedOutsideObligation_presentInc : combinedOutsideObligation_presentInc || 0,
            maxEMI_presentInc : maxEMI_presentInc || 0,
            minEMI_presentInc : (.5 * combinedRepaymentCapacity_presentInc)-combinedOutsideObligation_presentInc || 0
        }

        stressObj.repaymentOnFutureIncome = {
            combinedRepaymentCapacity_futureInc : combinedRepaymentCapacity_futureInc || 0,
            combinedOutsideObligation_futureInc : combinedOutsideObligation_futureInc || 0,
            maxEMI_futureInc : maxEMI_futureInc || 0,
            minEMI_futureInc : (.5 * combinedRepaymentCapacity_futureInc)-combinedOutsideObligation_futureInc || 0
        }
        // stressObj.combinedRepaymentCapacity_presentInc = combinedRepaymentCapacity_presentInc || 0;
        // stressObj.combinedOutsideObligation_presentInc = combinedOutsideObligation_presentInc || 0;
        // stressObj.maxEMI_presentInc = maxEMI_presentInc || 0;
        // stressObj.minEMI = (.5 * combinedRepaymentCapacity_presentInc)-combinedOutsideObligation_presentInc || 0;
        salStressPercentageConsolidated = calculateStress(salariedLatestInc, salariedFeb20Inc) || 0;
        othStressPercentageConsolidated = calculateStress(otherLatestInc, otherFeb20Inc) || 0;
        console.log("salStressPercentageConsolidated: "+salStressPercentageConsolidated);
        console.log("othStressPercentageConsolidated: "+ othStressPercentageConsolidated);

        if(salStressPercentageConsolidated === 0){
            if(othStressPercentageConsolidated < 50 && othStressPercentageConsolidated >= 0){
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
                    LTV[0] = LTVObj.case3;
                // else
                    //     LTV[1] = 0;
                stressType = "Severe Stress";
            }

        }else if(salStressPercentageConsolidated <= 25 && salStressPercentageConsolidated >= 0){
            if(othStressPercentageConsolidated === 0){
                consolidatedCaseType = "case-1";
                resolutionFramework = ["NA"];
                stressType = "Minimum Stress";
            }else if(othStressPercentageConsolidated < 50 && othStressPercentageConsolidated >= 0){
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
                    LTV[0] = LTVObj.case3;
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
                    LTV[0] = LTVObj.case3;
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
                    LTV[0] = LTVObj.case3;
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
        stressObj.applicants = applicantsObj;
        //stressObj.acctype = accType;
        console.log("stressObj for Loan and OD : "+ JSON.stringify(stressObj));

        

    }
    
    var monthlyInterest = 0;
    function monthlyIntCalc(annualInterest){
        annualInterest = annualInterest * .01;
        console.log(Math.pow(parseFloat((1+parseFloat(annualInterest))), parseFloat((1/12)))-1);
        monthlyInterest =  Math.pow(parseFloat((1+parseFloat(annualInterest))), parseFloat((1/12)))-1;
    }


    $( "#proposedROI" ).blur(function (){
       // alert("test");
        var proposedROI = Number($(this).val().trim());
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
        monthlyIntCalc(proposedROI);

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

    // 
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
            var x = Math.pow(1 + rate, nper);
            var fv_value = - ( -pmt + x * pmt + rate * x * pv ) /rate;
        }
        fv_value = conv_number(fv_value,2);
        return (fv_value);
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
            resRepPeriod = Math.max(blncLoanTenureValue, Number(minimumOfApplicantBlncPeriod));
            if(resRepPeriod > 180)
                resRepPeriod = resRepPeriod;
        }

        console.log("resRepPeriod  Inside: "+ resRepPeriod);
    }

    console.log("resRepPeriod  Outside: "+ resRepPeriod);

    //Calculator 4
    function calculateMaxExtension(){
        var temp = resRepPeriod - blncLoanTenureValue;
        if(accSchmSelectedVal === "HL" || accSchmSelectedVal === "TL" || accSchmSelectedVal === "ELWS"
        || accSchmSelectedVal === "ELWoS" || accSchmSelectedVal === "HLOD"){            
            if(temp <= 24 ){
                stressObj.maxExtension = true;
                stressObj.maxExtensionVal = temp; 
            }else{
                stressObj.maxExtension = false;
                stressObj.maxExtensionVal = temp; 
            }
                
        }else if(accSchmSelectedVal === "PL" || accSchmSelectedVal === "AL" || accSchmSelectedVal === "ML"
                || accSchmSelectedVal === "LL"  || accSchmSelectedVal === "GL"  || accSchmSelectedVal === "MLOD"
                || accSchmSelectedVal === "PLOD"  || accSchmSelectedVal === "FRR"){
            if(temp <= 18 ){
                stressObj.maxExtension = true;
                stressObj.maxExtensionVal = temp; 
            }else{
                stressObj.maxExtension = false;
                stressObj.maxExtensionVal = temp; 
            }
        }else{
            stressObj.maxExtension = "Error in CalculateMaxExtensionFunction";
            stressObj.maxExtensionVal = "Error in CalculateMaxExtensionFunction";
        }

    }

    //function 
    /****************Calculations Starts Here*************** */
    $('#btnCalculate').click(function(){
        blncLoanTenureValue = Number($('#blncLoanTenure').val().trim())
        //var accountType = $accType.val(); 
        stressObj = {}; //resetting global variable
        resolutionFramework = []; //resetting global variable
        stressType = ""; //resetting global variable
        LTV = [];
        createAccObject(); //To Create Account level object
        calculateLTV(); //To Calculate LTV for all scenario
        //calculateFOIR();
        maxOfSchmSnctdLTV = parseFloat(Math.max(sanctLTV.val().trim(), schmLTV.val().trim())).toFixed(2);
       // maxOfBlncTenureRetirementAge = parseInt(Math.max(blncLoanTenure.val().trim(), blncPeriodRetirement.val().trim()), 10);
         applicantsObj = [];   
        if(selectedAccType  === "frr"){
            var upto_month24 = 0, after_month24 = 0;
            var latestIncFRR = Number($('#latestInc-1').val().trim()) || 0;
            var feb20IncFRR = Number($('#feb20Inc-1').val().trim()) || 0;

            applicantsObj[0] = {
                name: $('#borrowerName-1').val().trim(),
                latestInc: latestIncFRR,
                feb20Inc: feb20IncFRR,
                blncPrdSnctnTrm: $('#blncPrdSnctnTrm-1').val().trim()
            }
           
            var stressPercentageFRR = calculateStress(latestIncFRR, feb20IncFRR) || 0;
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
                stressObj.stressType = "Mild Stress";
                console.log("CASE 2 OF SALARIED of getFOIROfIndividualBrwr");
                //FOIR
                upto_month24 = {upto24Months: latestIncFRR};
                after_month24 = {after24Months: feb20IncFRR};
            }else if(stressPercentageFRR > 40 && stressPercentageFRR < 100){
                stressObj.case = "case-6";
                stressObj.resolutionFramework = ["R1","R2","M1","M2","M1R1","M1R2","M2R1","M2R2"];
                if(LTVObj.case1 <= maxOfSchmSnctdLTV)
                    LTV[0] = LTVObj.case1;
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3;   
                stressObj.stressType = "Severe Stress";
                //FOIR
                upto_month24 = {upto24Months: latestIncFRR};
                after_month24 = {after24Months: feb20IncFRR};

            }else if(stressPercentageFRR == 100){
                stressObj.case = "case-11";
                stressObj.resolutionFramework = ["M2","M2R1","M2R2"];
                if(LTVObj.case3 <= maxOfSchmSnctdLTV)
                    LTV[1] = LTVObj.case3; 
                stressType = "Severe Stress";
                upto_month24 = {upto24Months: (feb20IncFRR * .75)};
                after_month24 = {after24Months: feb20IncFRR};

            }else{
                stressObj.case = "nocase";
                stressObj.stressType.resolutionFramework = ["NA"];
            }
            console.log(LTV);
            stressObj.stressPercentage = stressPercentageFRR;
            stressObj.LTV = LTV;
            stressObj.applicants = applicantsObj;
            console.log("stressObj : "+ JSON.stringify(stressObj));
        }else if(selectedAccType  === "loan"){
            calculateConsolidatedIncome("loan");
           
        }else if(selectedAccType  === "od"){
            calculateConsolidatedIncome("od");
        }else{
            
            console.log("Account Type None");
        }
        getEMIforR1();

        getEMIforR2();

        getEMIforM1();
    });

    //var presentOutstanding = 0;
    function calculateTenureExtension(monthlyInterest, isR1){
        console.log("INSIDE CALCULATE TENURE EXTENSION FUNCTION");
        var maxTenureExtn = 0;
        var presentOutstanding = Number(prsntOutstdng.val().trim());
        var minEmi = 0;
        var EMI24M = 0;
       // alert($accType.val());
        if($accType.val() == "loan" && ("HL" == $accSchm.val() || "ELWS" == $accSchm.val()|| "ELWoS" == $accSchm.val())){
            maxTenureExtn = 24;
           
        }else{
            maxTenureExtn = 18;
        }

        if(isR1){
            EMI24M = pmt(monthlyInterest, blncLoanTenureValue + maxTenureExtn, -presentOutstanding,0,0).toFixed(5);
            minEmi = stressObj.repaymentOnFutureIncome.minEMI_futureInc;
        }else{
            minEmi = stressObj.repaymentOnPresentIncome.minEMI_presentInc;
            var stepUpOutstndgAmt = fv(monthlyInterest,24, minEmi, -presentOutstanding);
            console.log("stepUpOutstndgAmt : "+ stepUpOutstndgAmt);
            EMI24M = pmt(monthlyInterest, blncLoanTenureValue + maxTenureExtn - 24, -stepUpOutstndgAmt,0,0).toFixed(5);
        }
        
        // console.log("EMI for 24m+ assuming full tenure extension : "+ EMI24M);
         if(EMI24M >= minEmi){
             console.log("EMI for 24m+ < min EMI : NO and final tenure extension is : "+ maxTenureExtn);
             return maxTenureExtn;
         }else{
             console.log("EMI for 24m+ < min EMI : NO and final tenure extension is : "+ 0);
             return 0;               
         }
    }

    function calculateMoratPeriod(){
        console.log("Sector Object is : "+ sectorObj);
        var frequency = {};
        //sectorObj = sectorObj.sort();
        jQuery.each(sectorObj, function(key,value) {
            if (!frequency.hasOwnProperty(value)) {
                frequency[value] = 1;
            } else {
                frequency[value]++;
            }
        });

        console.log("Object with max value is : "+ Object.keys(frequency).reduce(function(a, b){ return frequency[a] > frequency[b] ? a : b }));

        var keys = Object.keys(frequency),
            largest = Math.max.apply(null, keys.map(function (x) {
                                                        return frequency[x];
                                                    })),
            result = keys.reduce(function (result, key) {
                            if (frequency[key] === largest) {
                                result.push(key);
                            }

        return result.sort();
        }, []);
        console.log("RESULT : " + result);
        //var a1=0, a2=0, a3=0, a4=0, b1=0, b2=0, b3=0, b4=0, c1=0, d1=0;
        for( var i = 0; i<result.length; i++){
            if(result[i] == "A_ent" ||
                result[i] == "A_gem"|| 
                result[i] == "A_tou"||
                result[i] == "A_hos"){
                return 12;
            }else if(result[i] == "B_ele" ||
                     result[i] == "B_log" ||
                     result[i] == "B_met" ||
                     result[i] == "B_aut"){
                return 9;
            }else if(result[i] == "C_oth" ||
                     result[i] == "D_na" ){
                return 6;
            } else{
                alert("Error in calculateMoratPeriod function");
            }
        }
              
    }
    
    // Fucntion for calculation of Reschedule uniformly
    function getEMIforR1(){
        console.log("INSIDE GET EMI FOR R1 FUNCTION");
        var presentOutstanding = Number(prsntOutstdng.val().trim());
        var finalTenureExtnProvided = calculateTenureExtension(monthlyInterest, true);
        console.log("finalTenureExtnProvided :"+ finalTenureExtnProvided);
        var post24EMI = pmt(monthlyInterest,finalTenureExtnProvided + blncLoanTenureValue, -presentOutstanding,0,0);
        console.log(monthlyInterest +"\n"+ finalTenureExtnProvided +"\n"+blncLoanTenureValue +"\n"+finalTenureExtnProvided+blncLoanTenureValue +"\n"+presentOutstanding +"\n");
           
        console.log("post24EMI in R1 : "+post24EMI);
        alert("Cat 3: Post 24m EMI for R1 is: "+ post24EMI);
    }

    // Fucntion for calculation of Reschedule with step-up
    function getEMIforR2(){
        console.log("INSIDE GET EMI FOR R2 FUNCTION");
        var presentOutstanding = Number(prsntOutstdng.val().trim());

        //var stepUpPeriodR2 = Math.min(24, 24-)
        //var postStepUpOutstndgAmt = fv(monthlyIntCalc, )
       console.log("Calculated Moratorium : "+ calculateMoratPeriod());
       var finalTenureExtnProvided = calculateTenureExtension(monthlyInterest, false);
       var minEmi = stressObj.repaymentOnPresentIncome.minEMI_presentInc;
       var stepUpOutstndgAmt = fv(monthlyInterest,24, minEmi, -presentOutstanding);
       var post24EMI = pmt(monthlyInterest, finalTenureExtnProvided + blncLoanTenureValue-24, -stepUpOutstndgAmt,0,0);
       console.log("post24EMI in R2: "+post24EMI +" & Cat 2: Step up EMI in R2 " + minEmi);
       alert("Cat 3: Post 24m EMI for R2: "+post24EMI +" & Cat 2: Step up EMI in R2 " + minEmi);
    }

     // Fucntion for calculation of Reschedule with step-up
     function getEMIforM1(){
        console.log("INSIDE GET EMI FOR M1 FUNCTION");
        var moratoriupPeriod = calculateMoratPeriod();
        //estIntMoratorium
        var presentOutstanding = Number(prsntOutstdng.val().trim());
        var postMoratOutstndgAmt = fv(monthlyInterest, moratoriupPeriod, estIntMoratorium, -presentOutstanding);
        var post24EMI = pmt(monthlyInterest, blncLoanTenureValue- moratoriupPeriod, -postMoratOutstndgAmt,0,0);
        console.log("postMoratOutstndgAmt : "+ postMoratOutstndgAmt);
        console.log("Cat 1: Moratorium in M1: "+ estIntMoratorium +" & Cat 3: Post 24m EMI in M1 " + post24EMI);
        alert("Cat 1: Moratorium in M1: "+ estIntMoratorium +" & Cat 3: Post 24m EMI in M1 " + post24EMI);
        //var stepUpPeriodR2 = Math.min(24, 24-)
        //var postStepUpOutstndgAmt = fv(monthlyIntCalc, )
    //    console.log("Calculated Moratorium : "+ calculateMoratPeriod());
    //    var finalTenureExtnProvided = calculateTenureExtension(monthlyInterest, false);
    //    var minEmi = stressObj.repaymentOnPresentIncome.minEMI_presentInc;
    //    var stepUpOutstndgAmt = fv(monthlyInterest,24, minEmi, -presentOutstanding);
    //    var post24EMI = pmt(monthlyInterest, finalTenureExtnProvided + blncLoanTenureValue-24, -stepUpOutstndgAmt,0,0);
    //    console.log("post24EMI in R2: "+post24EMI +" & Cat 2: Step up EMI in R2 " + minEmi);
    //    alert("Cat 3: Post 24m EMI for R2: "+post24EMI +" & Cat 2: Step up EMI in R2 " + minEmi);
    }

    
   /*() function calculateNPER(rate, payment, present, future, type) {
        // Initialize type
        var type = (typeof type === 'undefined') ? 0 : type;
      
        // Initialize future value
        var future = (typeof future === 'undefined') ? 0 : future;
      
        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        rate = eval(rate);
        console.log("INSIDE NPER RATE: "+ rate);
        // Return number of periods
        var num = payment * (1 + rate * type) - future * rate;
        console.log("INSIDE NPER NUM: "+ num);
        var den = (present * rate + payment * (1 + rate * type));
        console.log("INSIDE NPER DEN: "+ den);
        console.log("NPER CALCULATED IS : "+ Math.log(num / den) / Math.log(1 + rate));
        return Math.log(num / den) / Math.log(1 + rate);
    }
    */


    /****************Calculations Ends Here*************** */
});