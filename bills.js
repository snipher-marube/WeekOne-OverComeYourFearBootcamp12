
//Access the form input values and then sum them..
function myFunction()
{
    let rent, shopping, electricity, water, transport, otherBills;
          
        rent = parseInt(document.getElementById('rent').value);
        shopping = parseInt(document.getElementById('shopping').value);
        electricity = parseInt(document.getElementById('electricity-bill').value);
        water = parseInt(document.getElementById('water-bill').value);
        transport = parseInt(document.getElementById('transport').value);
        otherBills = parseInt(document.getElementById('other').value);
        const sum = rent + shopping + electricity + water + transport + otherBills;
        document.getElementById('total').value = sum;

    }
    
        

// the submit button containing the net salary from the user..
//get the balance 
function submitFunction()
{
    let netSalary;
    netSalary = parseInt(document.getElementById('salary').value);
    const balance =((document.getElementById('salary').value) - (document.getElementById('total').value));
    document.getElementById('balance').value = balance;
}
//should indicate warning when  less than 20% of the net salary...
if((document.getElementById('balance').value) < (20/100 * (document.getElementById('salary'))))
{
    console.log('Above 20%');
}
else
{
    console.log('Below 20%');
}

//function to add categories to the form
function listFunction()
{
        let count = 0;
        if(count < 50)
        {
        let labelInput = document.createElement("input");
        labelInput.setAttribute("type", "text" );
        labelInput.setAttribute("name", "Bills");
        labelInput.setAttribute("placeholder", "bills");

        let amountInput= document.createElement("input");
        amountInput.setAttribute("type", "number");
        amountInput.setAttribute("name", "amount");
        amountInput.setAttribute("placeholder", "amount");
        amountInput.setAttribute("id", "other")

       document.getElementById('form-bills').append(labelInput , amountInput);
       
       //document.getElementById('form-bills').append(inputs);
        }
        
    }
    
 