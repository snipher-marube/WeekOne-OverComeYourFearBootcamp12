// console.log("tax calculation i ")

const grossInput = document.getElementById("gross-input-input");
const NSSFContribution = 1080;
const PersonalRelief = 2400;
const Insurance_NHIF_Relief = 210;
const NHIFContribution = 1400;

function get_PAYE_rate_monthy(amount) {
  let rate = 0;
  switch (amount) {
    case amount > 32332:
      rate = 0.3;
      break;
    case amount > 24000:
      rate = 0.25;
      break;

    default:
      rate = 0.1;
      break;
  }

  return rate;
}

grossInput.addEventListener("input", calculateTax);

function calculateTax(event) {
  const grossValue = parseFloat(event.target.value);

  let netPay = 0;

  // 1. Deduct PAYE
  const PAYE_Rate = get_PAYE_rate_monthy(grossValue);
  const PAYE_deductible_amount = grossValue * PAYE_Rate;
  netPay = netPay + (grossValue - PAYE_deductible_amount);
  // 2. Deduct NSSF Contribution
  netPay = netPay - NSSFContribution;
  // 3. Deduct NHIF Contribution
  netPay = netPay - NHIFContribution;
  // 4. Add Insurance/NHIF Relief
  netPay = netPay + Insurance_NHIF_Relief;
  // 5. Add Personal Relief
  netPay = netPay + PersonalRelief;

  console.log({ netPay });
}
