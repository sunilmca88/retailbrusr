$(document).ready(function () {

    /******Variable Initialisation starts here******/
   
    window.salStressPercentageConsolidated = 0;
    window.othStressPercentageConsolidated = 0;

  /*  var loanOptions = {
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
    var isFRR = "" ; //for enabling and disabling borrower type dropdown
  
    var $accType = $("#accType");
    var $accSchm = $("#accScheme");
    var $noOfApplicant = $("#noOfApplicant");*/
    var $borrowerType = $('#borrowerType');
    var $gmbrType = $('#gmbrType'), selectedBorrowerType = "";
    /******Variable Initialisation ends here******/

    /******Default function Initialisation starts here******/
    $('[data-toggle="tooltip"]').tooltip(); //Initializing  tooltip
    $('#rowSal').hide();
    $('#rowGMBR').hide();
    $('#rowRent').hide();
    $('#rowResult').hide();
    $('#btnChkElgblty').attr('disabled', true);
   // $('#staticBackdrop').modal();
    /******Default function Initialisation ends here******/

    $borrowerType.change(function(){
        selectedBorrowerType = $('option:selected', this).val();
        $('#txtCombinedLatestSalary').val("");
        $('#txtCombinedFeb20Salary').val("");
        $('#txtCombinedLatestGMBR').val("");
        $('#txtCombinedFeb20GMBR').val("");       
        $('#txtLatestRent').val("");
        $('#txtFeb20Rent').val("");
        $('#rowResult').hide();
        $('#gmbrType').val("GMBR2019").change();
        if("sal" === selectedBorrowerType){
            $('#rowSal').show();
            $('#rowGMBR').hide();
            $('#rowRent').hide();
            $('#lblCombinedLatestSalary').html('Combined Latest Salary of all Borrowers <sup><span class="badge btn-bob">i</span></sup>');
            $('#lblCombinedFeb20Salary').html('Combined Salary of all Borrowers as on 29 Feb 2020 <sup><span class="badge btn-bob">i</span></sup>');
        }else if("oth" === selectedBorrowerType){
            $('#lblCombinedLatestGMBR').html('Combined GMBR of all Borrowers during last month <sup><span class="badge btn-bob">i</span></sup>');
            $('#lblGMBR1920').html('Combined GMBR of all Borrowers during Same month in 2019 <sup><span class="badge btn-bob">i</span></sup>');
            $('#rowSal').hide();
            $('#rowGMBR').show();
            $('#rowRent').hide();   
        }else if("salAndOth" === selectedBorrowerType){
            $('#lblCombinedLatestSalary').html('Combined Latest Salary of all Salaried Borrowers <sup><span class="badge btn-bob">i</span></sup>');
            $('#lblCombinedFeb20Salary').html('Combined Salary of all Salaried Borrowers as on 29 Feb 2020 <sup><span class="badge btn-bob">i</span></sup>');
            $('#lblCombinedLatestGMBR').html('Combined GMBR of all Other Individuals Borrowers during last month <sup><span class="badge btn-bob">i</span></sup>');
            $('#lblGMBR1920').html('Combined GMBR of all Other Individuals Borrowers during Same month in 2019 <sup><span class="badge btn-bob">i</span></sup>');
            $('#rowSal').show();
            $('#rowGMBR').show();
            $('#rowRent').hide();   
        }else if("laFrr" === selectedBorrowerType){
            $('#rowSal').hide();
            $('#rowGMBR').hide();
            $('#rowRent').show();   
        }else{
            $('#errTxt').text("There is some error on page");
            $('#staticBackdrop').modal();
            $('#btnChkElgblty').attr('disabled', true);
        }
        $('#btnChkElgblty').removeAttr('disabled');
    });

    $gmbrType.change(function(){
        $('#rowResult').hide();
        $('#txtCombinedFeb20GMBR').val("");
        var selectedGMBRType = $('option:selected', this).val();
        //console.log("AAAAAAAAAAAAAA"+selectedGMBRType);
        //console.log("BBBBBBBBBBBBB"+selectedBorrowerType);
        if("GMBR2019" === selectedGMBRType && "oth" === selectedBorrowerType){
            $('#lblGMBR1920').html("Combined GMBR of all Borrowers during Same month of 2019 <sup><span class='badge btn-bob'>i</span></sup>");
        }else if("GMBR2020" === selectedGMBRType  && "oth" === selectedBorrowerType){
            $('#lblGMBR1920').html("Combined GMBR of all Borrowers during Feb 2020 <sup><span class='badge btn-bob'>i</span></sup>");
        }else if("GMBR2019" === selectedGMBRType && "salAndOth" === selectedBorrowerType){
            $('#lblGMBR1920').html('Combined GMBR of all Other Individuals Borrowers during Same month in 2019 <sup><span class="badge btn-bob">i</span></sup>');
        }else if("GMBR2020" === selectedGMBRType  && "salAndOth" === selectedBorrowerType){
            $('#lblGMBR1920').html('Combined GMBR of all Other Individuals Borrowers during Feb 2020 <sup><span class="badge btn-bob">i</span></sup>');
        }// else{
        //     $('#errTxt').text("There is some error on page");
        //     $('#staticBackdrop').modal();
        // }
    });

   
    function calculateStress(latestInc, feb20Inc){
        console.log(latestInc +"\n"+ feb20Inc);
        console.log(feb20Inc-latestInc);
        console.log(feb20Inc-latestInc > 0);
        if(feb20Inc-latestInc >= 0){
            console.log("Calculated Stress: "+ parseFloat((((feb20Inc-latestInc)/feb20Inc)*100).toFixed(5)));
            return parseFloat((((feb20Inc-latestInc)/feb20Inc)*100).toFixed(5));
        }else{
            showFailureResult();
            return 0;
        }
    };

    function showSuccessResult(){
        $('#result').html("You are provisionally eligible for resolution under the framework. Please download the application form as per link below and approach base branch alongwith application form and necessary documents to proceed further. Please note that final eligibility for resolution framework will be subject to other criterias as per Bank’s extant guidelines such as value of available security, age, repayment capacity, etc. Please note down the URN and mention the same on application form. ");
        $('#rowResult').show();
    }

    function showFailureResult(){
        $('#result').html("Thank you for having relationship with Bank of Baroda. However, we regret to inform that you do not satisfies the minimum stress criteria for resolution as per Bank’s extant guidelines. You may contact your base Branch for clarifications.");
        $('#rowResult').show();
    }

    $('#btnChkElgblty').click(function(){
        $('#rowResult').hide();
        var latestInc = 0, feb20Inc = 0, stressPercentage = 0;
        if("sal" === selectedBorrowerType){
            latestInc = $('#txtCombinedLatestSalary').val().trim();
            feb20Inc = $('#txtCombinedFeb20Salary').val().trim();
            if("" != latestInc && "" != feb20Inc && $.isNumeric(latestInc) && $.isNumeric(feb20Inc)){
                stressPercentage = calculateStress(latestInc, feb20Inc) || 0;
                if(stressPercentage <= 25){
                    showFailureResult();
                    // $('#result').html("You are <b>not eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#result').html("You are <b>Not Eligible</b> for resolution as per Bank's extant norms. Kindly contact your base Branch for clarifications.");
                    // $('#rowResult').show();
                }else{
                    showSuccessResult();
                    // $('#result').html("You are <b>eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#result').html("You are <b>eligible</b> for resolution under framework. Please download the application form as per link below and approach base branch for necessary approval.");
                    // $('#rowResult').show();
                }                
            }else{
                $('#errTxt').text("All fields are mandatory and only numbers are allowed");
                $('#staticBackdrop').modal();
            }
           
        }else if("oth" === selectedBorrowerType){
            latestInc = $('#txtCombinedLatestGMBR').val().trim();
            feb20Inc = $('#txtCombinedFeb20GMBR').val().trim();
            if("" != latestInc && "" != feb20Inc && $.isNumeric(latestInc) && $.isNumeric(feb20Inc)){
                stressPercentage = calculateStress(latestInc, feb20Inc) || 0;
                if(stressPercentage < 50){
                    showFailureResult();
                    //$('#result').html("You are <b>not eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#result').html("You are <b>Not Eligible</b> for resolution as per Bank's extant norms. Kindly contact your base Branch for clarifications.");
                    // $('#rowResult').show();
                }else{
                    showSuccessResult();
                    // $('#result').html("You are <b>eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#rowResult').show();
                }
            }else{
                $('#errTxt').text("All fields are mandatory and only numbers are allowed");
                $('#staticBackdrop').modal();
            }
        }else if("salAndOth" === selectedBorrowerType){
            latestInc = $('#txtCombinedLatestSalary').val().trim();
            feb20Inc = $('#txtCombinedFeb20Salary').val().trim();
            var latestGMBR = $('#txtCombinedLatestGMBR').val().trim();
            var feb20GMBR = $('#txtCombinedFeb20GMBR').val().trim();
            if(
                ("" != latestInc && "" != feb20Inc && $.isNumeric(latestInc) && $.isNumeric(feb20Inc)) &&
                ("" != latestGMBR && "" != feb20GMBR && $.isNumeric(latestGMBR) && $.isNumeric(feb20GMBR))
            ){
                var salStressPercentage = calculateStress(latestInc, feb20Inc) || 0;
                var GMBRStressPercentage = calculateStress(latestGMBR, feb20GMBR) || 0;
                if(salStressPercentage <= 25 && GMBRStressPercentage < 50){
                    // $('#result').html("You are <b>not eligible</b> as Stress percentage of Salary Income is  <b>" +salStressPercentage+"%</b>"+
                    // "and that of GMBR Income is <b>"+ GMBRStressPercentage +"%</b>");
                    // $('#rowResult').show();
                    showFailureResult();
                }else{
                    // $('#result').html("You are <b>eligible</b> as Stress percentage of Salary Income is  <b>" +salStressPercentage+"%</b>"+
                    // "and that of GMBR Income is <b>"+ GMBRStressPercentage +"%</b>");
                    // $('#rowResult').show();
                    showSuccessResult();
                }                
            }else{
                $('#errTxt').text("All fields are mandatory and only numbers are allowed");
                $('#staticBackdrop').modal();
            }
        }else if("laFrr" === selectedBorrowerType){
            latestInc = $('#txtLatestRent').val().trim();
            feb20Inc = $('#txtFeb20Rent').val().trim();
            if("" != latestInc && "" != feb20Inc && $.isNumeric(latestInc) && $.isNumeric(feb20Inc)){
                stressPercentage = calculateStress(latestInc, feb20Inc) || 0;
                if(stressPercentage <= 25){
                    // $('#result').html("You are <b>not eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#rowResult').show();
                    showFailureResult();
                }else{
                    showSuccessResult();
                    // $('#result').html("You are <b>eligible</b> as Stress percentage is <b>" +stressPercentage+"%</b>");
                    // $('#rowResult').show();
                }
            }else{
                $('#errTxt').text("All fields are mandatory and only numbers are allowed");
                $('#staticBackdrop').modal();
            }  
        }else{
            $('#errTxt').text("There is some error on page");
            $('#staticBackdrop').modal();
        }

    });

    
  
    /****************Calculations Ends Here*************** */
});