import * as CONSTANTS from "./constants.js";
import { calculateTax } from "./taxCalculation.js";

String.prototype.toStartCase = function () {
  return this.charAt(0).toUpperCase() + this.substring(1);
};

window.addEventListener("DOMContentLoaded", loadBillApplication);

// getOpenTab() Function and BILL_TAB_NAME Variable are available in this script
// because they are defined in tabController.js that is not a type=module

const $grossInput = document.getElementById("gross-input-input");
const $netSalaryViewOnlyInput = document.getElementById("net-salary-view-only");

let $billEntriesContainer = document.getElementById("result-bills-list");
let $billEntryControls = document.getElementById("bill-box-entry-controls");
let $billForm = document.getElementById("bill-form-edit-mode");
let $billFormSubmitBtn = document.getElementById(
  "bill-form-edit-mode-submit-btn"
);
let $editExpensesBtn = $billEntryControls?.querySelector(
  "button#edit-expenses"
);
let $saveExpensesBtn = $billEntryControls?.querySelector(
  "button#save-edit-expenses"
);
let $cancelExpensesBtn = $billEntryControls?.querySelector(
  "button#cancel-edit-expenses"
);
let $addNewExpenseBtn = document.querySelector(
  "button#add-new-bill-entry-expense"
);
let $deleteExpenseEntryBtn = document.querySelectorAll(".delete-action-icon");
let $totalExpenditureResults = document.querySelector(".billing-results");
let $remainingBalance = document.querySelector(".billing-balance");

/* ------WHEN TABS CHANGE - START------- */
const $tabsContainer = document.getElementById("result");
$tabsContainer.addEventListener("tabChange", loadBillApplication);
/* ------WHEN TABS CHANGE - END------ */

const expensesArr = [
  {
    expense: "Rent",
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
  $grossInput.disabled = false;
  if (getOpenTab() !== CONSTANTS.BILL_TAB_NAME) {
    // removing gross input listener when different tab is opened
    $grossInput.removeEventListener("input", runBillingLogic, true);
    $editExpensesBtn?.removeEventListener("click", onEditExpenses, true);
    $cancelExpensesBtn?.removeEventListener(
      "click",
      onCancelEditExpenses,
      true
    );
    $addNewExpenseBtn?.removeEventListener("click", onAddNewExpenseEntry, true);
    $saveExpensesBtn?.removeEventListener("click", onHitSaveBtn, true);

    return;
  }

  // Rehydrate DOM elements
  $billEntryControls = document.getElementById("bill-box-entry-controls");
  $editExpensesBtn = $billEntryControls?.querySelector("button#edit-expenses");

  injectExpensesOnDOM_NonEditMode();
  runBillingLogic();

  $grossInput.addEventListener("input", runBillingLogic, true);
  $editExpensesBtn?.addEventListener("click", onEditExpenses);
}

// Logic for Billing
function runBillingLogic(event) {
  // Rehydrate DOM elements
  $totalExpenditureResults = document.querySelector(".billing-results");
  $remainingBalance = document.querySelector(".billing-balance");
  const $balanceWarning = document.querySelector(".bill-box-entry-warning");

  let grossInputInitial;
  $grossInput.value ? (grossInputInitial = $grossInput.value) : 0;
  const grossValue = parseFloat(event?.target?.value || grossInputInitial);
  const taxationResults = calculateTax(grossValue);

  const netSalary = taxationResults.netPay;

  const totalExpenses = expensesArr.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const balance = Math.round((netSalary - totalExpenses) * 100) / 100;

  // Inject bill total and balance to DOM
  let $totalExpenditureResultsMoneyValue =
    $totalExpenditureResults.querySelector(".money-value");
  let $remainingBalanceMoneyValue =
    $remainingBalance.querySelector(".money-value");

  /* Add warning (color coded , preferably red) if balance after bill calculations
  is below 20% of total net , and green if within safe amount. */
  if (grossInputInitial > 0) {
    const _20PercentOfNetSalary = netSalary * 0.2;
    if (balance < _20PercentOfNetSalary) {
      $remainingBalance.style.color = "#dc3545";
      $balanceWarning.textContent = "Your balance is below 20% of net salary!";
      $balanceWarning.classList.add("low-balance");
      $balanceWarning.classList.remove("safe-balance");
    } else {
      $remainingBalance.style.color = "#198754";
      $balanceWarning.classList.add("safe-balance");
      $balanceWarning.classList.remove("low-balance");
    }
  } else {
    $remainingBalance.style.color = "inherit";
    $balanceWarning.classList.remove("safe-balance", "low-balance");
  }

  $netSalaryViewOnlyInput.value = new Intl.NumberFormat().format(netSalary);
  $totalExpenditureResultsMoneyValue.textContent =
    new Intl.NumberFormat().format(totalExpenses);
  if (grossInputInitial > 0) {
    $remainingBalanceMoneyValue.textContent = new Intl.NumberFormat().format(
      balance
    );
  } else {
    $remainingBalanceMoneyValue.textContent = "---";
  }
}

function onEditExpenses() {
  // Disable gross input when editing
  $grossInput.disabled = true;

  $editExpensesBtn = $billEntryControls.querySelector("button#edit-expenses");
  $editExpensesBtn.removeEventListener("click", onEditExpenses, true);

  // Modify List ready for editing
  injectExpensesOnDOM_EditMode();

  // Modify Controls to Edit Mode
  controlsModifier({ mode: "edit" });
}

function injectExpensesOnDOM_EditMode() {
  while ($billEntriesContainer.firstChild) {
    $billEntriesContainer.firstChild.remove();
  }

  const fragment = new DocumentFragment();
  const formElement = document.createElement("form");
  formElement.id = "bill-form-edit-mode";
  formElement.addEventListener("submit", onSaveExpenses, true);

  for (let i = 0; i < expensesArr.length; i++) {
    const item = expensesArr[i];

    const billEntry = document.createElement("span");
    billEntry.className = "bill-box-entry bill-box-entry-edit-mode";
    /* ---------------------------------------------------------------- */
    const billEntryExpenseNameBox = document.createElement("span");
    /* ---------------------------------------------------------------- */
    const billEntryExpenseNameInput = document.createElement("input");
    billEntryExpenseNameInput.type = "text";
    billEntryExpenseNameInput.required = true;
    billEntryExpenseNameInput.min = "0";
    billEntryExpenseNameInput.value = item.expense;
    billEntryExpenseNameInput.name = item.expense.replace(/\s/g, "-");
    billEntryExpenseNameInput.className = "expense-name";
    /* ---------------------------------------------------------------- */
    const billEntryExpenseMoneyBox = document.createElement("span");
    /* ---------------------------------------------------------------- */
    const billEntryMoneySign = document.createElement("span");
    billEntryMoneySign.className = "money-sign";
    /* ---------------------------------------------------------------- */
    const billEntryMoneySignText = document.createTextNode("Ksh.");
    /* ---------------------------------------------------------------- */
    const billEntryMoneyValueInput = document.createElement("input");
    billEntryMoneyValueInput.type = "number";
    billEntryMoneyValueInput.required = true;
    billEntryMoneyValueInput.min = "0";
    billEntryMoneyValueInput.name =
      item.expense.replace(/\s/g, "-") + "-amount";
    billEntryMoneyValueInput.value = item.amount;
    billEntryMoneyValueInput.className = "expense-money-value";
    /* ---------------------------------------------------------------- */
    const billEntryActionBox = document.createElement("span");
    billEntryActionBox.className = "bill-item-action-box";
    const billEntryActionBoxImg = document.createElement("img");
    billEntryActionBoxImg.src = "/resources/icons/delete.png";
    billEntryActionBoxImg.className = "delete-action-icon";
    billEntryActionBoxImg.width = "25";
    /* ---------------------------------------------------------------- */

    // Appending to associated parent
    billEntryExpenseNameBox.appendChild(billEntryExpenseNameInput);
    billEntryMoneySign.appendChild(billEntryMoneySignText);
    billEntryExpenseMoneyBox.appendChild(billEntryMoneySign);
    billEntryExpenseMoneyBox.appendChild(billEntryMoneyValueInput);
    billEntryActionBoxImg.addEventListener("click", onRemoveExpenseEntry, true);
    billEntryActionBox.appendChild(billEntryActionBoxImg);

    billEntry.appendChild(billEntryExpenseNameBox);
    billEntry.appendChild(billEntryExpenseMoneyBox);
    billEntry.appendChild(billEntryActionBox);

    // Appending to document fragment
    formElement.appendChild(billEntry);
  }

  /* ---------------------------------------------------------------- */
  const formElementSubmitBtn = document.createElement("input");
  formElementSubmitBtn.type = "submit";
  formElementSubmitBtn.value = "submit";
  formElementSubmitBtn.id = "bill-form-edit-mode-submit-btn";
  formElementSubmitBtn.style.display = "none";
  /* ---------------------------------------------------------------- */
  formElement.appendChild(formElementSubmitBtn);

  fragment.appendChild(formElement);

  // Finally append fragment to DOM
  $billEntriesContainer.appendChild(fragment);
}

function injectExpensesOnDOM_NonEditMode() {
  $billEntriesContainer = document.getElementById("result-bills-list");
  while ($billEntriesContainer.firstChild) {
    $billEntriesContainer.firstChild.remove();
  }

  const fragment = new DocumentFragment();
  for (let i = 0; i < expensesArr.length; i++) {
    const item = expensesArr[i];

    const billEntry = document.createElement("div");
    billEntry.id = "result-bill";
    billEntry.className = "bill-box-entry bill-item";
    const billEntryTitle = document.createElement("span");
    billEntryTitle.className = "bill-box-entry-title";
    const billEntryCurrencyBox = document.createElement("span");
    billEntryCurrencyBox.className = "bill-box-entry-currency";
    billEntryCurrencyBox.id = `${item.expense.replace(/\s/g, "-")}-bill`;
    const billEntryMoneySign = document.createElement("span");
    billEntryMoneySign.className = "money-sign";
    const billEntryMoneyValue = document.createElement("span");
    billEntryMoneyValue.className = "money-value";
    // text nodes
    const billEntryTitleText = document.createTextNode(item.expense);
    const billEntryMoneySignText = document.createTextNode("Ksh.");
    const billEntryMoneyValueText = document.createTextNode(
      new Intl.NumberFormat().format(item.amount)
    );

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

function onHitSaveBtn() {
  // Submit our for containing the bill values
  $billFormSubmitBtn = document.getElementById(
    "bill-form-edit-mode-submit-btn"
  );
  // $billForm = document.getElementById("bill-form-edit-mode");
  $billFormSubmitBtn.click();
}

function onSaveExpenses(event) {
  event.preventDefault();

  expensesArr.splice(0);
  // const newValues = [];
  const nodeList = $billEntriesContainer.getElementsByClassName(
    "bill-box-entry-edit-mode"
  );

  for (let i = 0; i < nodeList.length; i++) {
    const element = nodeList[i];

    const expenseName = element.querySelector(".expense-name");
    const expenseMoneyValue = element.querySelector(".expense-money-value");
    const newEntryObj = {
      expense: expenseName.value.toStartCase(),
      amount: parseFloat(expenseMoneyValue.value),
    };

    if (expenseName.value && expenseMoneyValue.value) {
      expensesArr.push(newEntryObj);
    }
  }

  // Make gross input interactive again
  $grossInput.disabled = false;

  unregisterNewEntryControlListeners();

  injectExpensesOnDOM_NonEditMode();
  runBillingLogic();

  // Modify Controls to NonEdit Mode
  controlsModifier({ mode: "noedit" });
}

function onCancelEditExpenses() {
  // Make gross input interactive again
  $grossInput.disabled = false;

  unregisterNewEntryControlListeners();

  injectExpensesOnDOM_NonEditMode();

  // Modify Controls to NonEdit Mode
  controlsModifier({ mode: "noedit" });
}

function unregisterNewEntryControlListeners() {
  const inputs = document.querySelectorAll(
    ".bill-box-entry,bill-box-entry-edit-mode span input"
  );
  Array.from(inputs).forEach((inp) => {
    // Remove listener that gives name attr to the input
    inp.removeEventListener("input", provideNameToNewEntryInput, true);
  });

  $billForm = document.getElementById("bill-form-edit-mode");
  $saveExpensesBtn = $billEntryControls?.querySelector(
    "button#save-edit-expenses"
  );
  $cancelExpensesBtn = $billEntryControls.querySelector(
    "button#cancel-edit-expenses"
  );
  $addNewExpenseBtn = document.querySelector(
    "button#add-new-bill-entry-expense"
  );
  $deleteExpenseEntryBtn = document.querySelectorAll(".delete-action-icon");

  $cancelExpensesBtn?.removeEventListener("click", onCancelEditExpenses, true);
  $billForm?.removeEventListener("click", onSaveExpenses, true);
  $saveExpensesBtn?.removeEventListener("click", onHitSaveBtn, true);
  $addNewExpenseBtn?.removeEventListener("click", onAddNewExpenseEntry, true);
  Array.from($deleteExpenseEntryBtn).forEach((deleteBtn) => {
    deleteBtn?.removeEventListener("click", onRemoveExpenseEntry, true);
  });
}

function onAddNewExpenseEntry() {
  const billEntry = document.querySelector(
    "#bill-box-entry-template-structure"
  );
  const billForm = document.getElementById("bill-form-edit-mode");
  let tmp = billEntry.content
    .cloneNode(true)
    .querySelector(".bill-box-entry.bill-box-entry-edit-mode");

  // Cleaning inputs in our template
  const inputs = tmp.querySelectorAll(
    ".bill-box-entry.bill-box-entry-edit-mode span input"
  );
  Array.from(inputs).forEach((inp) => {
    if (inp.type === "text") {
      // Add listener to give name to the input
      inp.addEventListener("input", provideNameToNewEntryInput, true);
    }
    inp.value = "";
    inp.name = "";
  });
  // Add listener to remove btn
  const deleteEntryBtn = tmp.querySelector(".delete-action-icon");
  deleteEntryBtn?.addEventListener("click", onRemoveExpenseEntry, true);

  billForm.insertAdjacentElement("beforeend", tmp);
}

function onRemoveExpenseEntry(event) {
  event.target.parentElement.parentElement.remove();
}

function provideNameToNewEntryInput(event) {
  const inputValue = event.target.value;
  // const moneyInput = event.target.parentElement.nextElementSibling.children[1];
  const moneyInput = event.target.parentElement.parentElement.querySelector(
    ".expense-money-value"
  );
  let inputName = inputValue;
  if (typeof inputName === "string") {
    inputName = inputName.replace(/\s/g, "-");
  }

  event.target.name = inputName;
  moneyInput.name = `${inputName}-amount`;
}

function controlsModifier(settings = { mode: "noedit" }) {
  const fragment = new DocumentFragment();

  while ($billEntryControls.firstChild) {
    $billEntryControls.firstChild.remove();
  }
  if (settings.mode === "edit") {
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn btn-secondary me-3";
    saveBtn.id = "save-edit-expenses";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn btn-secondary";
    cancelBtn.id = "cancel-edit-expenses";
    const saveBtnText = document.createTextNode("save");
    const cancelBtnText = document.createTextNode("cancel");

    // Appending to associated parent
    saveBtn.append(saveBtnText);
    saveBtn.addEventListener("click", onHitSaveBtn, true);
    cancelBtn.append(cancelBtnText);
    cancelBtn.addEventListener("click", onCancelEditExpenses, true);

    // Append to fragment
    fragment.appendChild(saveBtn);
    fragment.appendChild(cancelBtn);

    // ADD Button to DOM for ADD New Entry
    const addNewBillEntryBox = document.createElement("span");
    addNewBillEntryBox.className = "bill-box-entry";
    const addNewBillEntryBtn = document.createElement("button");
    addNewBillEntryBtn.className = "btn btn-primary";
    addNewBillEntryBtn.id = "add-new-bill-entry-expense";
    const addNewBillEntryBtnText = document.createTextNode("add new");

    // Append controls to associated parent
    addNewBillEntryBtn.appendChild(addNewBillEntryBtnText);
    addNewBillEntryBtn.addEventListener("click", onAddNewExpenseEntry, true);
    addNewBillEntryBox.appendChild(addNewBillEntryBtn);

    // Insert ADD controls to DOM
    $billEntriesContainer.insertAdjacentElement(
      "beforeend",
      addNewBillEntryBox
    );
  } else {
    const editExpenseBtn = document.createElement("button");
    editExpenseBtn.className = "btn btn-primary";
    editExpenseBtn.id = "edit-expenses";
    const editExpenseBtnText = document.createTextNode("edit expenses");

    // Appending to associated parent
    editExpenseBtn.append(editExpenseBtnText);
    editExpenseBtn.addEventListener("click", onEditExpenses);

    // Appending to fragment
    fragment.appendChild(editExpenseBtn);
  }
  // Add to DOM
  $billEntryControls.appendChild(fragment);
}
