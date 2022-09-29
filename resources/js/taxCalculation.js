import * as CONSTANTS from "./constants.js";

function calculateTax(event, grossInitial) {
  const grossValue = parseFloat(event?.target?.value || grossInitial);
  // console.log("calc tax ran", grossValue);
  const deductionsBeforeTax =
    CONSTANTS.NHIFContribution + CONSTANTS.NSSFContribution;
  let taxablePay = 0;
  if (grossValue < deductionsBeforeTax) {
    taxablePay = grossValue;
  } else if (!isNaN(grossValue)) {
    taxablePay = grossValue - deductionsBeforeTax;
  }

  // After deducting contributions, we are ready to tax
  const PAYE_Tax = calculatePAYETax(taxablePay);

  const taxationResults = {
    taxablePay,
    ...PAYE_Tax,
  };

  return taxationResults;
}
function calculatePAYETax(taxablePay = 0) {
  taxablePay = isNaN(taxablePay) ? 0 : taxablePay;

  let trackingAmount = taxablePay;
  const deductions = [];
  let taxPayableBeforeRelief = 0;
  let taxPayableAfterRelief = 0;
  let finalTaxPayable = 0;
  let netPay = 0;
  const sumOfReliefsGranted =
    CONSTANTS.MonthlyPersonalRelief + CONSTANTS.Insurance_NHIF_Relief;
  const results = {
    deductions,
    taxPayableBeforeRelief,
    taxPayableAfterRelief,
    finalTaxPayable,
    netPay,
    monthlyPersonalRelief: CONSTANTS.MonthlyPersonalRelief,
    insurance_nhif_relief: CONSTANTS.Insurance_NHIF_Relief,
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
  const isTaxableFirstRound = trackingAmount - CONSTANTS.PAYEFirstRoundAmount;

  if (isTaxableFirstRound < 0) {
    console.log("UNtaxable in ROUND1", deductions);
    return calculateDeductions();
  }

  const deductionAmount_1 =
    CONSTANTS.PAYEFirstRoundAmount * CONSTANTS.PAYEFirstRoundRate;
  deductions.push(deductionAmount_1);
  trackingAmount -= deductionAmount_1;

  /* 2. Second Round */
  const isTaxableSecondRound = trackingAmount - CONSTANTS.PAYESecondRoundAmount;

  if (isTaxableSecondRound < 0) {
    console.log("NOT taxable in ROUND2", deductions);
    return calculateDeductions();
  }

  const deductionAmount_2 =
    CONSTANTS.PAYESecondRoundAmount * CONSTANTS.PAYESecondRoundRate;
  deductions.push(deductionAmount_2);
  trackingAmount -= deductionAmount_2;

  /* 3. Third Round */
  const PAYE_RoundOne_RoundTwo_Total =
    CONSTANTS.PAYEFirstRoundAmount + CONSTANTS.PAYESecondRoundAmount;

  if (trackingAmount < PAYE_RoundOne_RoundTwo_Total) {
    console.log("NOT taxable in ROUND3", deductions);
    return calculateDeductions();
  }
  const deductionAmount_3 =
    (taxablePay - PAYE_RoundOne_RoundTwo_Total) * CONSTANTS.PAYEThirdRoundRate;
  deductions.push(deductionAmount_3);

  return calculateDeductions();
}

export { calculateTax };
