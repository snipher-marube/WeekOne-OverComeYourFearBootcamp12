window.addEventListener("DOMContentLoaded", loadTaxApplication);

const $grossInput = document.getElementById("gross-input-input");
const $netSalaryViewOnlyInput = document.getElementById("net-salary-view-only");

$tabsContainer.addEventListener("tabChange", (e) => {
  if (getOpenTab() !== TAX_TAB_NAME) return;
  let grossInputInitial;
  $grossInput.value ? (grossInputInitial = $grossInput.value) : 0;
  // if ($grossInput.value) {
  //   e.target.value = $grossInput.value;
  //   console.log("$grossInput.value", $grossInput.value);
  //   console.log(e.target.value);
  //   calculateTax(e);
  // }
  loadTaxApplication(e, grossInputInitial);
});

function loadTaxApplication(event, grossInitial) {
  const $nhifContrib = document.getElementById("nhif-contrib");
  const $nssfContrib = document.getElementById("nssf-contrib");
  const $insuranceRelief = document.getElementById("insurance-relief");
  const $personalRelief = document.getElementById("personal-relief");
  const $taxableSalary = document.getElementById("taxable-salary");
  const $taxWithoutRelief = document.getElementById("tax-without-relief");
  const $taxPayable = document.getElementById("tax-payable");
  const $netIncome = document.getElementById("net-income");

  /* Contributions are deducted from gross salary to get taxable pay
  -> Reference - https://www.kra.go.ke/individual/filing-paying/types-of-taxes/pay
*/
  const NSSFContribution = 1080;
  const NHIFContribution = 1400;
  /* Reliefs are deducted from the calculated tax */
  const Insurance_NHIF_Relief = 210;
  const MonthlyPersonalRelief = 2400;
  // PAYE TAXATION
  const PAYEFirstRoundAmount = 24000;
  const PAYEFirstRoundRate = 0.1;
  const PAYESecondRoundAmount = 8333;
  const PAYESecondRoundRate = 0.25;
  const PAYEThirdRoundRate = 0.3;

  // Add Listener to input
  $grossInput.addEventListener("input", calculateTax);

  // Inject constant values to DOM
  // NHIF
  const $nhifContribValue = $nhifContrib.querySelector(".money-value");
  $nhifContribValue.innerText = NHIFContribution;
  // NSSF
  const $nssfContribValue = $nssfContrib.querySelector(".money-value");
  $nssfContribValue.innerText = NSSFContribution;

  // Allows to run taxcalculation when we have a value in gross input field.
  // Helpful when you switch back to a Tab
  if (grossInitial) {
    calculateTax();

    // After calculate tax, remove the value to allow oninput listener to fully
    // control the logic
    grossInitial = undefined;
  }

  // Logic for Tax Calculation
  function calculateTax(event) {
    const grossValue = parseFloat(event?.target?.value || grossInitial);
    // console.log("calc tax ran", grossValue);
    const deductionsBeforeTax = NHIFContribution + NSSFContribution;
    let taxablePay = 0;
    if (grossValue < deductionsBeforeTax) {
      taxablePay = grossValue;
      $nhifContrib.parentElement.classList.add("unavailable");
      $nssfContrib.parentElement.classList.add("unavailable");
    } else {
      if (!isNaN(grossValue)) {
        taxablePay = grossValue - deductionsBeforeTax;
      }
      $nhifContrib.parentElement.classList.remove("unavailable");
      $nssfContrib.parentElement.classList.remove("unavailable");
    }
    // After deducting contributions, we are ready to tax
    const PAYE_Tax = calculatePAYETax(taxablePay);

    const taxationResults = {
      taxablePay,
      ...PAYE_Tax,
    };

    // console.log(taxationResults);
    injectDOMWithTaxResults(taxationResults);
  }

  function calculatePAYETax(taxablePay = 0) {
    taxablePay = isNaN(taxablePay) ? 0 : taxablePay;

    let trackingAmount = taxablePay;
    const deductions = [];
    let taxPayableBeforeRelief = 0;
    let taxPayableAfterRelief = 0;
    let finalTaxPayable = 0;
    let netPay = 0;
    const sumOfReliefsGranted = MonthlyPersonalRelief + Insurance_NHIF_Relief;
    const results = {
      deductions,
      taxPayableBeforeRelief,
      taxPayableAfterRelief,
      finalTaxPayable,
      netPay,
      monthlyPersonalRelief: MonthlyPersonalRelief,
      insurance_nhif_relief: Insurance_NHIF_Relief,
    };

    function calculateDeductions() {
      taxPayableBeforeRelief = deductions.reduce((acc, cur) => acc + cur, 0);
      taxPayableAfterRelief =
        taxPayableBeforeRelief - sumOfReliefsGranted < 0
          ? 0
          : taxPayableBeforeRelief - sumOfReliefsGranted;
      finalTaxPayable = taxPayableAfterRelief;
      netPay = taxablePay - finalTaxPayable;

      Object.assign(results, {
        deductions,
        taxPayableBeforeRelief,
        taxPayableAfterRelief,
        finalTaxPayable,
        netPay,
      });
      return results;
    }

    /* 1. First round */
    const isTaxableFirstRound = trackingAmount - PAYEFirstRoundAmount;

    if (isTaxableFirstRound < 0) {
      console.log("UNtaxable in ROUND1", deductions);
      return calculateDeductions();
    }

    const deductionAmount_1 = PAYEFirstRoundAmount * PAYEFirstRoundRate;
    deductions.push(deductionAmount_1);
    trackingAmount -= deductionAmount_1;

    /* 2. Second Round */
    const isTaxableSecondRound = trackingAmount - PAYESecondRoundAmount;

    if (isTaxableSecondRound < 0) {
      console.log("NOT taxable in ROUND2", deductions);
      return calculateDeductions();
    }

    const deductionAmount_2 = PAYESecondRoundAmount * PAYESecondRoundRate;
    deductions.push(deductionAmount_2);
    trackingAmount -= deductionAmount_2;

    /* 3. Third Round */
    const PAYE_RoundOne_RoundTwo_Total =
      PAYEFirstRoundAmount + PAYESecondRoundAmount;

    if (trackingAmount < PAYE_RoundOne_RoundTwo_Total) {
      console.log("NOT taxable in ROUND3", deductions);
      return calculateDeductions();
    }
    const deductionAmount_3 =
      (taxablePay - PAYE_RoundOne_RoundTwo_Total) * PAYEThirdRoundRate;
    deductions.push(deductionAmount_3);

    return calculateDeductions();
  }

  function injectDOMWithTaxResults(payload) {
    // Add insurance relief to DOM
    const $insuranceReliefValue =
      $insuranceRelief.querySelector(".money-value");
    $insuranceReliefValue.innerText = new Intl.NumberFormat().format(
      payload.insurance_nhif_relief
    );
    // console.log("$insuranceReliefValue", $insuranceReliefValue);

    // Add personal relief to DOM
    const $personalReliefValue = $personalRelief.querySelector(".money-value");
    $personalReliefValue.innerText = new Intl.NumberFormat().format(
      payload.monthlyPersonalRelief
    );

    // Add taxable salary to DOM
    const $taxableSalaryValue = $taxableSalary.querySelector(".money-value");
    $taxableSalaryValue.innerText = new Intl.NumberFormat().format(
      payload.taxablePay
    );

    // Add tax payable to DOM
    const $taxWithoutReliefValue =
      $taxWithoutRelief.querySelector(".money-value");
    $taxWithoutReliefValue.innerText = new Intl.NumberFormat().format(
      payload.taxPayableBeforeRelief
    );

    // Add tax payable to DOM
    const $taxPayableValue = $taxPayable.querySelector(".money-value");
    $taxPayableValue.innerText = new Intl.NumberFormat().format(
      payload.finalTaxPayable
    );

    // Add Net Income to DOM
    const $netIncomeValue = $netIncome.querySelector(".money-value");
    $netIncomeValue.innerText = new Intl.NumberFormat().format(payload.netPay);
    $netSalaryViewOnlyInput.value = new Intl.NumberFormat().format(
      payload.netPay
    );
  }
}
