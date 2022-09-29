// css based js functions
function showTaxCalculator() {
  document.getElementById("bills").style.display = "none";
  document.getElementById("result-bills").style.display = "none";
  document.getElementById("gross").style.display = "block";
  document.getElementById("result-tax").style.display = "block";
}

function showBillManager() {
  document.getElementById("bills").style.display = "block";
  document.getElementById("result-bills").style.display = "block";
  document.getElementById("gross").style.display = "none";
  document.getElementById("result-tax").style.display = "none";
  getRemainingAmount();
}

function changeActiveTab() {
  document.getElementById("tab-one").className = "not-active";
  document.getElementById("tab-two").className = "active";
}

function changeBackActiveTab() {
  document.getElementById("tab-one").className = "active";
  document.getElementById("tab-two").className = "not-active";
}

function showModal() {
  document.getElementById("modal").className = "modal show";
}

function hideModal(total_bills) {
  document.getElementById("modal").className = "modal hide";
  if (total_bills != undefined) {
    document.getElementById("total-bills").innerHTML = `Ksh. ${total_bills}`;
  }
}

// function changeMenuIcon() {
//   if (
//     document.getElementById("menu-bars-icon").className == "fa-solid fa-bars"
//   ) {
//     document.getElementById("menu-bars-icon").className = "fa-solid fa-xmark";
//     document.getElementById("header").className = "header active";
//   } else {
//     document.getElementById("menu-bars-icon").className = "fa-solid fa-bars";
//     document.getElementById("header").className = "header";
//   }
// }

// function centerMenuIcon() {
//   var menuHeight = document.getElementById("menu-bars-icon");
//   var headerHeight = document.getElementById("header").clientHeight;
//   document.getElementById("menu-icon").style.top = `${headerHeight / 3}px`;
// }

// centerMenuIcon();

function createBillResult(category, amount) {
  const result_bill = document.createElement("div");
  result_bill.setAttribute("id", "result-bill");
  result_bill.setAttribute("class", category);

  // span element in div
  const result_bill_span = document.createElement("span");
  result_bill_span.innerHTML = category;
  result_bill.append(result_bill_span);

  // div inside result-bill
  const result_bill_div = document.createElement("div");
  result_bill_div.id = "result-bill-div";
  const result_bill_div_span = document.createElement("span");
  const result_bill_div_input = document.createElement("input");
  result_bill_div_span.innerHTML = "Ksh.";
  result_bill_div_input.setAttribute("readonly", true);
  result_bill_div_input.value = amount;
  const result_bill_delete = document.createElement("button");
  result_bill_delete.id = "delete-bill";
  const result_bill_delete_span = document.createElement("span");
  result_bill_delete_span.innerHTML = "Delete";
  result_bill_delete.appendChild(result_bill_delete_span);

  // implemementation
  document
    .getElementById("result-bills-list")
    .appendChild(result_bill)
    .appendChild(result_bill_div)
    .appendChild(result_bill_div_span)
    .append(result_bill_div_input);
  document
    .getElementById("result-bills-list")
    .appendChild(result_bill)
    .appendChild(result_bill_div)
    .appendChild(result_bill_div_span)
    .append(result_bill_delete);
}

let bill_category;
let bill_amount;
let total_bills = 0;

function getInput() {
  bill_category = document.getElementById("bill-category").value;
  bill_amount = parseInt(document.getElementById("bill-amount").value);

  createBillResult(bill_category, bill_amount);

  // add result-bill input to total_bills
  total_bills = total_bills + bill_amount;
  hideModal(total_bills);

  // show remaining amount
  getRemainingAmount();
}

// function changeRemainingColor(net)

// remove result-bill onclick and remove default

//tax logic js
let grossSalary;
let netSalary = 0;
let remainingAmount = netSalary;

const getGrossSalary = () => {
  grossSalary = parseInt(document.getElementById("gross-salary").value);
};

let nhifContribution = 1400;
let nssfContribution = 1080;
let insuranceRelief = 210;
let personalRelief = 2400;

document.getElementById(
  "nhif-contribution"
).innerHTML = `Ksh. ${nhifContribution}`;
document.getElementById(
  "nssf-contribution"
).innerHTML = `Ksh. ${nssfContribution}`;
document.getElementById(
  "insurance-relief"
).innerHTML = `Ksh. ${insuranceRelief}`;
document.getElementById("personal-relief").innerHTML = `Ksh. ${personalRelief}`;

let totalTax =
  nhifContribution + nssfContribution + insuranceRelief + personalRelief;
document.getElementById("total-tax").innerHTML = `Ksh. ${totalTax}`;

const netSalaryAmount = () => {
  getGrossSalary();
  netSalary = grossSalary - totalTax;
  const netSalaryInput = document.getElementById("net-salary");
  netSalaryInput.setAttribute("value", netSalary);
  changeActiveTab();
  showBillManager();
};

const getRemainingAmount = () => {
  remainingAmount = netSalary - total_bills;
  document.getElementById(
    "remaining-amount"
  ).innerHTML = `Ksh. ${remainingAmount}`;
};
