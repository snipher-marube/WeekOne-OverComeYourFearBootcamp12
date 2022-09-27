// Global Variables
// count is a global variable that assigns a unique id to every added category
var count = 0;
function showTaxCalculator(){
    document.getElementById('bills').style.display = 'none';
    document.getElementById('result-bills').style.display = 'none';
    document.getElementById('gross').style.display = 'block';
    document.getElementById('result-tax').style.display = 'block';
  }
  
  function showBillManager() {
    document.getElementById('bills').style.display = 'block';
    document.getElementById('result-bills').style.display = 'block';
    document.getElementById('gross').style.display = 'none';
    document.getElementById('result-tax').style.display = 'none';
  }
  
  function changeActiveTab() {
    document.getElementById('tab-one').className = 'not-active';
    document.getElementById('tab-two').className = 'active';
  }
  
  function changeBackActiveTab() {
    document.getElementById('tab-one').className = 'active';
    document.getElementById('tab-two').className = 'not-active';
  }
  
  function showModal() {
    document.getElementById('modal').className = 'modal show'
  }
  
  function hideModal() {
    document.getElementById('modal').className = 'modal hide'
  }
  
  function createBillResult(category, amount) {
    const result_bill =document.createElement('div');
    result_bill.setAttribute('id', 'result-bill');
  
    // span element in div
    const result_bill_span = document.createElement('span');
    result_bill_span.innerHTML = category;
    result_bill.append(result_bill_span);
  
    // div inside result-bill
    const result_bill_div = document.createElement('div');
    const result_bill_div_span = document.createElement('span');
    const result_bill_div_input = document.createElement('input');
    result_bill_div_span.innerHTML = 'Ksh.';
    result_bill_div_input.setAttribute('id',count);
    result_bill_div_input.value = amount;
    // count is a global variable that assigns a unique id to every added category
    count++;
  
    // implemementation
    document.getElementById('result-bills-list').appendChild(result_bill).appendChild(result_bill_div).appendChild(result_bill_div_span).append(result_bill_div_input);
  }
  
  let bill_category;
  let bill_amount;
  
  function getInput() {
    bill_category = document.getElementById('bill-category').value;
    bill_amount = parseInt(document.getElementById('bill-amount').value);
  
    createBillResult(bill_category, bill_amount)
    hideModal()
  }
  
  // remove result-bill onclick and remove default