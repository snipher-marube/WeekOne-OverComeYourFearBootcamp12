/**
 * Order of scripts in your HTML should be:
 *    1. tabController.js
 *    2. taxManager.js
 *    3. billManager.js
 */
import * as CONSTANTS from "./constants.js";

// const CONSTANTS.TAX_TAB_NAME = "tax-tab";
// const CONSTANTS.BILL_TAB_NAME = "bill-tab";

// GLOBAL SIGNAL to control adding of listeners on gross input when tabs change
// const controller = new AbortController();

// Get active tab
// Can be tax-tab or bill-tab
const $displayArea = document.querySelector("section.main_content_result");
const $taxContentArea = document.querySelector(".main_content_result_tax");
const $billContentArea = document.querySelector(".bills-content-template");
const $taxTemplateContent = document.querySelector(
  "template#tax-content-template"
);
const $billTemplateContent = document.querySelector(
  "template#bills-content-template"
);
const $taxTabBtn = document.getElementById("tax-tab-btn");
const $billTabBtn = document.getElementById("bill-tab-btn");
const $tabsContainer = document.getElementById("result");

let activeTab = getOpenTab();
window.getOpenTab = getOpenTab;

const tabChangeEvent = new Event("tabChange");

switch (activeTab) {
  case CONSTANTS.BILL_TAB_NAME:
    populateBillTab();
    break;

  default:
    populateTaxTab();
    break;
}

// Add listeners to tab button
$taxTabBtn.addEventListener("click", onTaxTabBtnClick);
$billTabBtn.addEventListener("click", onBillTabBtnClick);

function populateBillTab() {
  let $billContent = $billTemplateContent.content
    .cloneNode(true)
    .querySelector(".main_content_result_bills");
  // console.log($billContent);
  // $displayArea.appendChild($billContent);
  $displayArea.replaceChild($billContent, $displayArea.childNodes[0]);

  //  Setting the childNodes to null so that if it has associated
  //  listeners, they are removed by garbage collector
  // $displayArea.childNodes[0] = null;

  // Control active classes on open tabs
  $taxTabBtn.classList.remove(["active"]);
  $billTabBtn.classList.add(["active"]);
}
function populateTaxTab() {
  let $taxContent = $taxTemplateContent.content
    .cloneNode(true)
    .querySelector(".main_content_result_tax");
  $displayArea.replaceChild($taxContent, $displayArea.childNodes[0]);

  //  Setting the childNodes to null so that if it has associated
  //  listeners, they are removed by garbage collector
  // $displayArea.childNodes[0] = null;

  // Control active classes on open tabs
  $taxTabBtn.classList.add(["active"]);
  $billTabBtn.classList.remove(["active"]);
}

function getOpenTab() {
  let Tab = localStorage.getItem("open-tab");

  if (Tab) return JSON.parse(Tab);

  localStorage.setItem("open-tab", JSON.stringify(CONSTANTS.TAX_TAB_NAME));
  Tab = CONSTANTS.TAX_TAB_NAME;
  return Tab;
}

function onTaxTabBtnClick() {
  console.log("tax tab clicked");
  if (activeTab == CONSTANTS.TAX_TAB_NAME) return;
  populateTaxTab();
  localStorage.setItem("open-tab", JSON.stringify(CONSTANTS.TAX_TAB_NAME));
  activeTab = getOpenTab();
  $tabsContainer.dispatchEvent(tabChangeEvent);
}
function onBillTabBtnClick() {
  console.log("bill tab clicked");
  if (activeTab == CONSTANTS.BILL_TAB_NAME) return;
  populateBillTab();
  localStorage.setItem("open-tab", JSON.stringify(CONSTANTS.BILL_TAB_NAME));
  activeTab = getOpenTab();
  $tabsContainer.dispatchEvent(tabChangeEvent);
}
