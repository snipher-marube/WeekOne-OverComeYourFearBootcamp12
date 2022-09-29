import * as CONSTANTS from "./constants.js";
import { calculateTax } from "./taxCalculation.js";

window.addEventListener("DOMContentLoaded", loadTaxApplication);

// `getOpenTab()` Function is available in this script because it is attached
//  on the window object in tabController.js

// Element holding our tabs
const $tabsContainer = document.getElementById("result");
// Listening to whenever tab is changed
$tabsContainer.addEventListener("tabChange", (e) => {
  let grossInputInitial;
  $grossInput.value ? (grossInputInitial = $grossInput.value) : 0;
  loadTaxApplication(e, grossInputInitial);
});

// These DOM elements won't be changing when tabs change hence can be declared globally;
const $grossInput = document.getElementById("gross-input-input");
const $netSalaryViewOnlyInput = document.getElementById("net-salary-view-only");

let $nhifContrib = document.getElementById("nhif-contrib");
let $nssfContrib = document.getElementById("nssf-contrib");
let $insuranceRelief = document.getElementById("insurance-relief");
let $personalRelief = document.getElementById("personal-relief");
let $taxableSalary = document.getElementById("taxable-salary");
let $taxWithoutRelief = document.getElementById("tax-without-relief");
let $taxPayable = document.getElementById("tax-payable");
let $netIncome = document.getElementById("net-income");

let $nhifContribValue = $nhifContrib?.querySelector(".money-value");
let $nssfContribValue = $nssfContrib?.querySelector(".money-value");

function loadTaxApplication(event, grossInitial) {
  if (getOpenTab() !== CONSTANTS.TAX_TAB_NAME) {
    // removing gross input listener when different tab is opened
    console.log("Tax tab listener removed");
    $grossInput.removeEventListener("input", runTaxLogic, true);
    return;
  }

  // Rehydrating elements
  $nhifContrib = document.getElementById("nhif-contrib");
  $nssfContrib = document.getElementById("nssf-contrib");
  $insuranceRelief = document.getElementById("insurance-relief");
  $personalRelief = document.getElementById("personal-relief");
  $taxableSalary = document.getElementById("taxable-salary");
  $taxWithoutRelief = document.getElementById("tax-without-relief");
  $taxPayable = document.getElementById("tax-payable");
  $netIncome = document.getElementById("net-income");

  // Add Listener to gross salary input
  console.log("listener should be added by loadTaxApplication");
  $grossInput.addEventListener("input", runTaxLogic, true);

  // Inject Contributions values to DOM
  // NHIF
  $nhifContribValue = $nhifContrib.querySelector(".money-value");
  $nhifContribValue.innerText = CONSTANTS.NHIFContribution;
  // NSSF
  $nssfContribValue = $nssfContrib.querySelector(".money-value");
  $nssfContribValue.innerText = CONSTANTS.NSSFContribution;

  // Allows to run taxcalculation when we have a value in gross input field.
  // Helpful when you switch back to a Tab
  if (grossInitial) {
    runTaxLogic(undefined, grossInitial);

    // After calculate tax, remove the value to allow oninput listener to fully
    // control the logic
    grossInitial = undefined;
  }
}
// Logic for Tax Calculation
function runTaxLogic(event, grossInitial) {
  const grossValue = parseFloat(event?.target?.value || grossInitial);
  console.log("Listener by TAX MAN RUNNING");

  // Logic to make contributions unavailable when gross salary
  // is less than the contributions to make
  const deductionsBeforeTax =
    CONSTANTS.NHIFContribution + CONSTANTS.NSSFContribution;
  if (grossValue < deductionsBeforeTax) {
    $nhifContrib.parentElement.classList.add("unavailable");
    $nssfContrib.parentElement.classList.add("unavailable");
  } else {
    $nhifContrib.parentElement.classList.remove("unavailable");
    $nssfContrib.parentElement.classList.remove("unavailable");
  }

  // We receive an object with calculated tax results
  const taxationResults = calculateTax(event, grossInitial);

  // console.log(taxationResults);
  // Inject the tax results received to the DOM
  injectDOMWithTaxResults(taxationResults);
}

function injectDOMWithTaxResults(payload) {
  // Add insurance relief to DOM
  const $insuranceReliefValue = $insuranceRelief.querySelector(".money-value");
  $insuranceReliefValue.innerText = new Intl.NumberFormat().format(
    payload.insurance_nhif_relief
  );

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
