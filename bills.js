
// //Access the form input values and then sum them..
    
        

// // the submit button containing the net salary from the user..
// //get the balance 
// function submitFunction()
// {

//     let rent, shopping, electricity, water, transport, otherBills;
          
//         rent = parseInt(document.getElementById('rent').value);
//         shopping = parseInt(document.getElementById('shopping').value);
//         electricity = parseInt(document.getElementById('electricity-bill').value);
//         water = parseInt(document.getElementById('water-bill').value);
//         transport = parseInt(document.getElementById('transport').value);
//         otherBills = parseInt(document.getElementById('bill-amount').value);
//         const sum = rent + shopping + electricity + water + transport + otherBills;
//         document.getElementById('total').value = sum;

//     let netSalary;
//     netSalary = parseInt(document.getElementById('salary').value);
//     const balance =((document.getElementById('salary').value) - (document.getElementById('total').value));
//     document.getElementById('balance').value = balance;
// }
// //should indicate warning when  less than 20% of the net salary...
// if((document.getElementById('balance').value) < (20/100 * (document.getElementById('salary'))))
// {
//     document.getElementById('total').display = red;
// }
// else
// {
//     console.log('Below 20%');
// }

// //function to add categories to the form
// function listFunction()
// {
//         let count = 0;
//         if(count < 50)
//         {
//         let labelInput = document.createElement("input");
//         labelInput.setAttribute("type", "text" );
//         labelInput.setAttribute("name", "Bills");
//         labelInput.setAttribute("placeholder", "bills");

//         let amountInput= document.createElement("input");
//         amountInput.setAttribute("type", "number");
//         amountInput.setAttribute("name", "amount");
//         amountInput.setAttribute("placeholder", "amount");
//         amountInput.setAttribute("id", "other")

//        document.getElementById('form-bills').append(labelInput , amountInput);
       
//        //document.getElementById('form-bills').append(inputs);
//         }
        
//     }
    
 
//Access the form input values and then sum them..
// global variable, used by listfunction
var count = 0;




// function myFunction()
// {
//     let rent, shopping, electricity, water, transport, otherBills;
          
//         rent = parseInt(document.getElementById('rent').value);
//         shopping = parseInt(document.getElementById('shopping').value);
//         electricity = parseInt(document.getElementById('electricity-bill').value);
//         water = parseInt(document.getElementById('water-bill').value);
//         transport = parseInt(document.getElementById('transport').value);
//         otherBills = parseInt(document.getElementById('other').value);  //???
//         const sum = rent + shopping + electricity + water + transport + otherBills;
//         document.getElementById('total').value = sum;

//     }
    
        

// the submit button containing the net salary from the user..
//get the balance 

// Get the total bills and subtract from Netsalary
function submitFunction()
{
    let rent, shopping, electricity, water, transport,netSalary;
    var otherBills = 0;
    // get net salary
    netSalary = parseInt(document.getElementById('salary').value);
    // get default values
    rent = parseInt(document.getElementById('rent').value);
    shopping = parseInt(document.getElementById('shopping').value);
    electricity = parseInt(document.getElementById('electricity-bill').value);
    water = parseInt(document.getElementById('water-bill').value);
    transport = parseInt(document.getElementById('transport').value);
    // check if otherbills exists, if not otherbills should be zero
    let el=document.getElementById("0");
    if(el == null){
        otherBills = 0;
    }

    else{
        // loop through other bills and set amount to total bills present
        for(let i = 0; i<10 ; i++){
            // check if id exist, then extract value;
            let idVal = document.getElementById(i.toString());
            if(idVal != null){
                otherBills += parseInt(idVal.value);
                console.log(otherBills);
            }
            else{
                break;
            }
        }
    }

    console.log(otherBills);
    // Do the addition
    const sum = rent + shopping + electricity + water + transport + otherBills;
    // inject sum and balance value to page
    document.getElementById('total').value = sum;
    const balance = netSalary - sum;
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
        amountInput.setAttribute("id", "count")
        
        let Linebreak = document.createElement("br");
        document.getElementById('bill-add').append(labelInput , amountInput);
        document.getElementById('bill-add').append(Linebreak);

        count++;
        }
        
    }
    
 