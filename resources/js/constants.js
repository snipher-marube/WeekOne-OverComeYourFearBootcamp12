/* Contributions are deducted from gross salary to get taxable pay
  -> Reference - https://www.kra.go.ke/individual/filing-paying/types-of-taxes/pay
*/
/* Contributions */
export const NSSFContribution = 1080;
export const NHIFContribution = 1400;
/* Reliefs are deducted from the calculated tax */
export const Insurance_NHIF_Relief = 210;
export const MonthlyPersonalRelief = 2400;
// PAYE TAXATION
export const PAYEFirstRoundAmount = 24000;
export const PAYEFirstRoundRate = 0.1;
export const PAYESecondRoundAmount = 8333;
export const PAYESecondRoundRate = 0.25;
export const PAYEThirdRoundRate = 0.3;

// TABS names
export const TAX_TAB_NAME = "tax-tab";
export const BILL_TAB_NAME = "bill-tab";
