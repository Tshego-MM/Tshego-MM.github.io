function calculate(operand1, operand2, operator){
    let results = 0;
    switch (operator){
        case "+":
            results = operand1+operand2;
            break;
        case "-":
            results = operand1-operand2;
            break;
        case "/":
            if(operand2===0){
                throw new Error("Division by zero is not allowed");  
            }
            else{
                results = operand1/operand2;
            }
            break;
        case "*":
            results = operand1*operand2;
            break;
        case '^':
            if(operand1===0 && operand2===0){
                throw new Error("zero power zero is not allowed");
            }
            else{
                results = Math.pow(operand1, operand2);
            }
            break;
        default:
            throw new Error("The expression entered is invalid");
    }

    return results;
}

function sci(operand, operator){
    let results = 0;
    switch(operator){
        case 's':
            results = Math.sin(operand);
            break;
        case 'c':
            results = Math.cos(operand);
            break;
        case 't':
            if(operand===0){
                throw new Error("tan(0) is undefined");
            }
            else{
                results = Math.tan(operand);
            }
            break;
    }
    
    return results;
}

function precValue(operator){
    /**
     * Takes in an operator and returns its precedence value bodmas
     */
    let value = 0;
    switch(operator){
        case '-':
            value = 5;
            break;
        case '+':
            value = 4;
            break;
        case '*':
            value = 3;
            break;
        case '/':
            value = 2;
            break;
        case '(':
            value = 0;
            break;
        case ')':
            value = 0;
            break;
        case '^':
            value = 1;
            break;
        default:
            value = -1;
    }

    return value;
}

function precedence(operator, stackOperator){
    /**
     * Takes the current operator and compares it with the operator on the stack to see which one has 
     * higher precedence
     */
    return precValue(operator)<precValue(stackOperator);

}

function infixPos(infix){
    /**
     * Takes infix array and converts to postfix
     * This will allow us to keep track of brackets and follow BODMAS
     */
    let stack = [];  //keeps track of our brackets
    let postfix = []; //stores the resulting postfix notation
    for(let i=0; i<infix.length; ++i){
        if(infix[i]==='0' || +infix[i]){
            postfix.push(infix[i]);
        }
        else{
            if(infix[i]===')'){
                let lastVal = stack.pop(); //The last element of the array
                while(lastVal==='('){
                    postfix.push(lastVal);
                    lastVal = stack.pop();
                }
                
            }
            else if(infix[i]==='('){
                stack.push(infix[i]);
            }
            else if(stack.length===0 || stack[stack.length-1]==='('){
                stack.push(infix[i]);
            }
            else{
                if(precedence(infix[i], stack[stack.length-1])){
                    stack.push(infix[i]);
                }
                else{
                    let stackTop = stack.pop(); //The last element of the array
                    while(stack.length>0 && !precedence(infix[i], stack[stack.length-1]) && stackTop!=='('){
                        postfix.push(stackTop);
                        stackTop = stack.pop();
                    }
                    stack.push(infix[i]);
                }
            }
        }
    }

    while(stack.length>0){
        postfix.push(stack.pop())
    }
    
    return postfix;
}

function compute(infix){
    const postfix = infixPos(infix);
    let stack = [];
    for(let i=0; i<postfix.length; ++i){
        if(postfix[i]==='0' || +postfix[i]){
            stack.push(+postfix[i]);
        }
        else{
            try{
                let res = 0, v1 = stack.pop();
                if(postfix[i].includes('s') || postfix[i].includes('c') || postfix[i].includes('t')){
                    res = sci(v1, postfix[i]);
                }
                else{
                    let v2 = stack.pop();
                    res = calculate(v2, v1, postfix[i]);
                }
                stack.push(res);
            }
            catch(err){
                alert(err.message);
            }
        }
    }
    
    return stack.pop();
}


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

function clear(val){
    document.getElementById('screen').value = "";
    document.getElementById('output').value = "";
    return;
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
    let inputArr = []; //The operands and operators
    let tmpStr = ""; //Temporary string to build numbers with more than one digit
    let inputStr = document.getElementById('screen').value;  //The displayed string
    inputStr = inputStr.replace("sin", "s");
    inputStr = inputStr.replace("cos", "c");
    inputStr = inputStr.replace("tan", "t");

    for(let i=0; i<inputStr.length; ++i){
        console.log(inputStr.charAt(i))
        if(inputStr.charAt(i)==='0' || +inputStr.charAt(i) || inputStr.charAt(i)==='.'){
            tmpStr += inputStr.charAt(i);
        }
        else{
            if(tmpStr.length!==0){
                inputArr.push(tmpStr);
                tmpStr = "";
            }
            inputArr.push(inputStr.charAt(i));
        }
    }
    if(tmpStr.length!==0){   //The last number from the string
        inputArr.push(tmpStr);
        tmpStr = "";
    }
    let calc = compute(inputArr);
    document.getElementById("output").value = '='+calc;
    return;
}
