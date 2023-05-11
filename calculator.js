function calculate(operand1, operand2, operator){
    let results = 0;
    switch (operator){
        case "+":
            results = operand1+operand2;
            break;
        case "-":
            results = operand1-operand2;
            break;
        case "÷":
            if(operand2===0){
                throw new Error("Division by zero is not allowed");  
            }
            else{
                results = operand1/operand2;
            }
            break;
        case "×":
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
            if(Math.cos(operand)===0){
                throw new Error("tan("+operand+") is undefined");
            }
            else{
                results = Math.tan(operand);
            }
            break;
        case '√':
            if(operand<0){
                throw new Error("Cannot find square root of negative numbers");
            }
            else{
                results = Math.sqrt(operand);
            }
            break;
        case '%':
            results = (operand/100);
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
        case '×':
            value = 3;
            break;
        case '÷':
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
                while(lastVal && lastVal!=='('){
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
                    while(stackTop && !precedence(infix[i], stack[stack.length-1]) && stackTop!=='('){
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

function preprocess(inputStr){
    /**
     * Takes the input string and preprocesses it
     * And returns an array of the numbers and operations
     * This is to make the string compatible with our calculation functions
     */
    let inputArr = []; //The operands and operators
    let tmpStr = ""; //Temporary string to build numbers with more than one digit
    inputStr = inputStr.replace("sin", "s");
    inputStr = inputStr.replace("cos", "c");
    inputStr = inputStr.replace("tan", "t");
    const NoMultPattern = /[)\d]{1}[sct√]/g;  //This will find number implicitly multiplied by trig function (e.g 2sin(1)) and adds the multiplication
    const toFix = inputStr.match(NoMultPattern); //contains the values to fix
    if(toFix){
        toFix.forEach(element => {
            inputStr = inputStr.replaceAll(element, element.charAt(0)+'×'+element.charAt(1));
        });
    }

    for(let i=0; i<inputStr.length; ++i){
        if(inputStr.charAt(i)==='0' || +inputStr.charAt(i) || inputStr.charAt(i)==='.'){
            tmpStr += inputStr.charAt(i);
        }
        else{
            if(tmpStr.length>0){
                inputArr.push(tmpStr);
                tmpStr = "";
            }
            else if(inputStr.charAt(i)==='-'){
                if(i===0){
                    inputArr.push('-1');
                    inputArr.push('×');
                    continue;
                }
                else if(['+', '-', '÷', '×', '('].includes(inputStr.charAt(i-1))){
                    inputArr.push('-1');
                    inputArr.push('×');
                    continue;
                }
            }
            else if(inputStr.charAt(i)==='+'){
                if(i===0 || ['+', '-', '÷', '×', '('].includes(inputStr.charAt(i-1))){
                    continue;
                }
            }
            inputArr.push(inputStr.charAt(i));
        }
    }
    if(tmpStr.length>0){   //The last number from the string
        inputArr.push(tmpStr);
        tmpStr = "";
    }

    return inputArr;
}

function compute(inputStr){
    const infix = preprocess(inputStr);
    const postfix = infixPos(infix);
    let stack = [];
    for(let i=0; i<postfix.length; ++i){
        if(postfix[i]==='0' || +postfix[i]){
            stack.push(+postfix[i]);
        }
        else{
            try{
                let res = 0, v1 = stack.pop();
                if(['√', '%', 's', 'c', 't'].includes(postfix[i])){
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

export default compute;
