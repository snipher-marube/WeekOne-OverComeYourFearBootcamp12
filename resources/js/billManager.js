import * as CONSTANTS from "./constants.js";
import { calculateTax } from "./taxCalculation.js";

console.log("bill manager is connected!!");

window.addEventListener("DOMContentLoaded", loadBillApplication);

// getOpenTab() Function and BILL_TAB_NAME Variable are available in this script
// because they are defined in tabController.js that is not a type=module

const $grossInput = document.getElementById("gross-input-input");
const $netSalaryViewOnlyInput = document.getElementById("net-salary-view-only");

const $tabsContainer = document.getElementById("result");
// $tabsContainer is available because it is defined in tabController.js`
$tabsContainer.addEventListener("tabChange", (e) => {
  let grossInputInitial;
  $grossInput.value ? (grossInputInitial = $grossInput.value) : 0;
  loadBillApplication(e, grossInputInitial);
});

let $billEntriesContainer = document.getElementById("result-bills-list");

const expensesArr = [
  {
    expense: "rent",
    amount: 2000,
  },
  {
    expense: "shopping",
    amount: 300,
  },
  {
    expense: "food",
    amount: 6700,
  },
];

function loadBillApplication() {
  if (getOpenTab() !== CONSTANTS.BILL_TAB_NAME) {
    // removing gross input listener when different tab is opened
    $grossInput.removeEventListener("input", runBillingLogic, true);
    return;
  }

  // Rehydrate DOM element
  $billEntriesContainer = document.getElementById("result-bills-list");
  injectExpensesOnDOM();

  $grossInput.addEventListener("input", runBillingLogic, true);
}

// Logic for Billing
function runBillingLogic(event, grossInitial) {
  console.log("Listener added by Bill tab running");
  const grossValue = parseFloat(event?.target?.value || grossInitial);
  const taxationResults = calculateTax(event, grossInitial);
}

function injectExpensesOnDOM(payload) {
  while ($billEntriesContainer.firstChild) {
    $billEntriesContainer.firstChild.remove();
  }

  const fragment = new DocumentFragment();
  for (let i = 0; i < expensesArr.length; i++) {
    const item = expensesArr[i];

    const billEntry = document.createElement("div");
    billEntry.id = "result-bill";
    billEntry.className = "bill-entry";
    const billEntryTitle = document.createElement("span");
    billEntryTitle.className = "bill-entry-title";
    const billEntryCurrencyBox = document.createElement("span");
    billEntryCurrencyBox.className = "bill-entry-currency";
    billEntryCurrencyBox.id = `${item.expense}-bill`;
    const billEntryMoneySign = document.createElement("span");
    billEntryMoneySign.className = "money-sign";
    const billEntryMoneyValue = document.createElement("span");
    billEntryMoneyValue.className = "money-value";
    // text nodes
    const billEntryTitleText = document.createTextNode(item.expense);
    const billEntryMoneySignText = document.createTextNode("Ksh.");
    const billEntryMoneyValueText = document.createTextNode(item.amount);

    // Appending
    billEntryTitle.append(billEntryTitleText);
    billEntryMoneySign.append(billEntryMoneySignText);
    billEntryMoneyValue.append(billEntryMoneyValueText);
    billEntryCurrencyBox.appendChild(billEntryMoneySign);
    billEntryCurrencyBox.appendChild(billEntryMoneyValue);
    billEntry.appendChild(billEntryTitle);
    billEntry.appendChild(billEntryCurrencyBox);

    // Appending to document fragment
    fragment.appendChild(billEntry);
  }

  // Finally append to DOM
  $billEntriesContainer.appendChild(fragment);
}
