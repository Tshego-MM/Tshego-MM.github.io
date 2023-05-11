import compute from './calculator.js';

function displayValue(currValue){
    /*
        * Takes in the current button value and concats it with the 
        * displayed screen value to update the displayed value on the screen
     */
    let results = document.getElementById('screen').value.toString()+currValue.toString();
    document.getElementById('screen').value = results;
    return;
}

function del(){
    /**
        * Delete the recently added value 
     */
    let dispVal = document.getElementById('screen').value.toString();  //The displayed value on the screen
    document.getElementById('screen').value = dispVal.slice(0, dispVal.length-1);
    document.getElementById('output').value = "";
    return;
}

function clearScreen(){
    document.getElementById('screen').value = "";
    document.getElementById('output').value = "";
    return;
}

function changeDetected(){
    const inputText = document.getElementById('screen');;
    inputText.addEventListener('change', (event) => {
        document.getElementById('output').value='';
    });
}

function keyEvent(event){
    /**
     * Detects numerical events, addition, division, multiplication, subtraction
     * and 2 arraow keys
     */
    let allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "ArrowRight", "ArrowLeft", "Backspace", 
        "+", "-"];
    if(event.key==='*'){
        event.preventDefault();
        document.getElementById("screen").value += '&times;';
    }
    else if(event.key==='/'){
        event.preventDefault();
        document.getElementById("screen").value += '&div;';
    }
    else if(!allowedKeys.includes(event.key)){
        event.preventDefault();
        return false;
    }
    return;
}

function equalSign(){
    const inputStr = document.getElementById('screen').value;
    let calc = compute(inputStr);
    if(isNaN(calc)){
        calc = "Error";
    }
    document.getElementById("output").value = '='+calc;
    return;
}

export {displayValue, del, clearScreen, changeDetected, keyEvent, equalSign};
