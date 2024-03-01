const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

//Even though you set an input element to be a number, JavaScript receives a string value.Write a function to clean the string value and ensure you have a number.
function cleanInputString(str) {
    /*//split your str into individual characters.
    const strArray=str.split('');
    //Declare a cleanStrArray variable and assign it an empty array. You will use this to store your valid number characters.
    const cleanStrArray=[];
    for(let i=0; i<strArray.length; i++){
        //check if the array ["+", "-", " "] does not include the current character.
        if(!["+","-"," "].includes(strArray[i])){
            cleanStrArray.push(strArray[i]);
        }
    }*/

    //The above works but for better efficiency, use regex.
    //const regex=/hello/;
    //const regex = /\+-/; //Note that you need to use the \ to escape the +, because a + has a special meaning in regular expressions.
    //const regex=/\+-\s/; //The character class \s will match any whitespace character. Note shorthand characters are preceded with a backslash.

    //const regex = /[+-\s]/; //Turn your +-\s pattern into a character class using[], because we want to match them individually. Note that you no longer need to escape the + character, because you are using a character class.

    const regex = /[+-\s]/g; //Regex can also take specific flags to alter the pattern matching behavior. Flags are added after the closing /. The g flag, which stands for "global", will tell the pattern to continue looking after it has found a match.

    //Use your regex to replace all instances of +, -, and a space in str with an empty string. Return this value.
    return str.replace(regex, "");
}

function isInvalidInput(str) {
    /*//In HTML, number inputs allow for exponential notation (such as 1e10). You need to filter those out.Declare a regex variable, and assign it a regex that matches the character e.
    const regex=/e/;*/

    /*//The e in a number input can also be an uppercase E. Regex has a flag for this, however – the i flag, which stands for "insensitive".This flag makes your pattern case-insensitive. Add the i flag to your regex pattern.
    const regex = /e/i;*/

    /*//Number inputs only allow the e to occur between two digits. To match any number, you can use the character class [0-9]. This will match any digit between 0 and 9. Add this character class before and after e in your pattern.
    const regex = /[0-9]e[0-9]/i;*/

    /*//The + modifier in a regex allows you to match a pattern that occurs one or more times. To match your digit pattern one or more times, add a plus after each of the digit character classes. For example: [0-9]+.
    const regex = /[0-9]+e[0-9]+/i;*/

    //There is a shorthand character class to match any digit: \d. Replace your [0-9] character classes with this shorthand.
    const regex = /\d+e\d+/i;

    //Strings have a .match() method, which takes a regex argument. .match() will return an array of match results – containing either the first match, or all matches if the global flag is used.Return the result of calling the .match() method on str and passing your regex variable as the argument.
    return str.match(regex);
}

//Next is to allow users to add entries to the calorie counter. Declare an empty function addEntry.
function addEntry() {
    /*const targetId = "#"+entryDropdown.value;
    //const targetInputContainer=document.querySelector(targetId+" .input-container");

    //Replace the above with templste literals.
    const targetInputContainer = document.querySelector(`${targetId} .input-container`);*/

    //Thanks to template literals, you actually don't need the targetId variable at all. Remove that variable, and update your template literal to replace targetId with entryDropdown.value – remember to add # before that, in the string.
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);

    /*//You will want to number the entries a user adds. To get all of the number inputs, you can use the querySelectorAll() method.Declare an entryNumber variable and give it the value of targetInputContainer.querySelectorAll().
    let entryNumber=targetInputContainer.querySelectorAll();*/

    //Pass the string input[type="text"] to the querySelectorAll() method.You can then access the length property of the NodeList to get the number of entries.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;//Try adding a couple of entries to the Breakfast category, and you may notice some bugs! The first thing we need to fix is the entry counts – the first entry should have a count of 1, not 0.This bug occurs because you are querying for input[type="text"] elements before adding the new entry to the page. To fix this, update your entryNumber variable to be the value of the length of the query plus 1.

    const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"/>
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"/>`;

    //targetInputContainer.innerHTML+=HTMLString;

    //Your other bug occurs if you add a Breakfast entry, fill it in, then add a second Breakfast entry. You'll see that the values you added disappeared.This is because you are updating innerHTML directly, which does not preserve your input content. Change your innerHTML assignment to use the insertAdjacentHTML() method of targetInputContainer instead.
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);//For the first argument, pass the string "beforeend" to insert the new element as the last child of targetInputContainer.For the second argument, pass your HTMLString variable.
}

function calculateCalories(e) {
    //Call the preventDefault() method on the e parameter. Then, reset your global error flag to false.
    e.preventDefault();
    isError = false;
    //Declare a breakfastNumberInputs variable, and give it the value of calling document.querySelectorAll() with the selector #breakfast input[type=number]. This will return any number inputs that are in the #breakfast element.
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');

    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');

    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');
    //Declare a breakfastCalories variable, and assign it the result of calling getCaloriesFromInputs with breakfastNumberInputs as the argument.
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    //Declare a budgetCalories variable and set it to the result of calling getCaloriesFromInputs – pass an array containing your budgetNumberInput as the argument.
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    //Add an if statement to your calculateCalories function that checks the truthiness of your global error flag, and if it is truthy then use return to end the function execution.
    if (isError) {
        return;
    }
    //It is time to start preparing your calculations. Start by declaring a consumedCalories variable, and assign it the sum of breakfastCalories, lunchCalories, dinnerCalories, and snacksCalories.
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories + exerciseCalories;
    //Declare a remainingCalories variable, and give it the value of subtracting consumedCalories from budgetCalories and adding exerciseCalories.
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    //Declare a surplusOrDeficit variable. Then use a ternary operator to set surplusOrDeficit to the string "Surplus" or "Deficit" depending on whether remainingCalories is less than 0. If it is less than 0, then surplusOrDeficit should be "Surplus". Otherwise, it should be "Deficit".
    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
    /*//You need to construct the HTML string that will be displayed in the output element. Start by assigning an empty template literal to the innerHTML property of the output element.
    output.innerHTML=``;*/

    /*//Your output.innerHTML string will need a span element. Create that, and give it a class attribute set to the surplusOrDeficit variable. Your surplusOrDeficit variable should be converted to lower case using the toLowerCase() method.
    output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}"></span>`;*/

    /*//Give your span the text remainingCalories Calorie surplusOrDeficit, using interpolation to replace remainingCalories and surplusOrDeficit with the appropriate variables.
    output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${remainingCalories} Calorie ${surplusOrDeficit}</span>
  `;*/

    /*//When the user has a calorie deficit, the remainingCalories value will be negative. You don't want to display a negative number in the result string.Use Math.abs().
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    `;*/

    /*//After your span element, add an hr element to create a horizontal line.
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>`;*/

    //Create a p element with the text budgetCalories Calories Budgeted, using interpolation to replace budgetCalories with the appropriate variable.
    output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;
    //Use the .remove() method of the output variable's classList property to remove the hide class.
    output.classList.remove("hide");
}

function getCaloriesFromInputs(list) {
    let calories = 0;
    //Create a for...of loop that loops through the list.
    for (const item of list) {
        /*//Assign item.value to a const variable called currVal.
        const currVal=item.value;*/

        //Update your currVal declaration to be the result of calling cleanInputString with item.value.
        const currVal = cleanInputString(item.value);

        //You also need to confirm the input is valid. Declare an invalidInputMatch variable, and assign it the result of calling your isInvalidInput function with currVal as the argument.
        const invalidInputMatch = isInvalidInput(currVal);

        //Add an if statement that checks if invalidInputMatch is truthy.
        if (invalidInputMatch) {
            //Using a template literal, in your if block, call the alert() function to tell the user "Invalid Input: ", followed by the first value in the invalidInputMatch array.
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            //set isError to true and return null.
            isError = true;
            return null;
        }
        //Use the addition assignment operator to add currVal to your calories total. You'll need to use the Number constructor to convert currVal to a number.
        calories += Number(currVal);
    }
    //After your for loop has completed, return the calories value.
    return calories;
}

function clearForm() {
    /*//Declare an inputContainers variable, and assign it to the value of querying the document for all elements with the class input-container.
    const inputContainers=document.querySelectorAll(".input-container");*/

    //Wrap your inputContainers query selector in Array.from().
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    //It is time for another loop. Create a for...of loop with a variable called container to iterate through the inputContainers array.Inside the loop, set the innerHTML property of the container to an empty string. This will clear all of the contents of that input container.
    for(const container of inputContainers){
        container.innerHTML="";
    }
    //Set the value property of budgetNumberInput to an empty string.
    budgetNumberInput.value="";
    //You also need to clear the output element's text. You can do this by setting the innerText property to an empty string.The difference between innerText and innerHTML is that innerText will not render HTML elements, but will display the tags and content as raw text.
    output.innerText="";
    //Add the hide class to your output.
    output.classList.add("hide");
}

//Call the .addEventListener() method on the addEntryButton. Pass in the string "click" for the first argument and the addEntry function for the second argument.Note that you should not call addEntry, but pass the variable (or function reference) directly.
addEntryButton.addEventListener('click', addEntry);
//Add an event listener to your calorieCounter element. The event type should be submit, and the callback function should be calculateCalories.
calorieCounter.addEventListener("submit", calculateCalories);
//Add an event listener to the clearButton button. When the button is clicked, it should call the clearForm function.
clearButton.addEventListener("click",clearForm);