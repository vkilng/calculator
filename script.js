const calcButtons = document.querySelectorAll('.btn');
let expWindow = document.getElementById('expression');
let ansWindow = document.querySelector('#answer');

function add(num1,num2) {
    return (num1+num2);
}
function subtract(num1,num2) {
    return (num1-num2);
}
function multiply(num1,num2) {
    return (num1*num2);
}
function divide(num1,num2) {
    return (num1/num2);
}
function power(num1,num2) {
    return (num1**num2);
}

function buildExpression(e) {
    let data = '';
    let expLength = expWindow.textContent.length;
    let lastChar = expWindow.textContent[expLength-1];
    if (e.key === undefined) {
        data = e.target.textContent;
    } else {
        data = e.key;
    }
    switch(data) {
        case '0':
            if (expWindow.textContent[expLength-2] === '\u00f7') {
                alert('Dividing by zero is undefined !');
            } else {
                expWindow.textContent += data;
            }
            if (isValidExpression(expWindow.textContent)
                && expWindow.textContent.includes(' ')) {
                ansWindow.textContent = evaluate(expWindow.textContent);
            } else {
                ansWindow.textContent = '';
            };
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            expWindow.textContent += data;
            if (isValidExpression(expWindow.textContent)
                && expWindow.textContent.includes(' ')) {
                ansWindow.textContent = evaluate(expWindow.textContent);
            } else {
                ansWindow.textContent = '';
            };
            break;
        case '.':
            if (!hasDecimalPoint(expWindow.textContent)) {
                if (expWindow.textContent === '' || (lastChar === ' ' || lastChar === '(')) {
                    expWindow.textContent += '0.';
                } else {
                    expWindow.textContent += '.';
                }
            };
            break;
        case 'Escape':
        case 'AC':
            expWindow.textContent = '';
            ansWindow.textContent = '';
            break;
        case 'Delete':
        case 'Backspace':
        case 'del':
            if (lastChar == ' ') {
                expWindow.textContent = expWindow.textContent.slice(0,-3);
            } else {
                expWindow.textContent = expWindow.textContent.slice(0,-1);
            };
            if(isValidExpression(expWindow.textContent)
                && expWindow.textContent.includes(' ')) {
                ansWindow.textContent = evaluate(expWindow.textContent);
            } else {
                ansWindow.textContent = '';
            };
            break;
        case '^':
        case 'x y':
            if (!isNaN(parseInt(lastChar))) {
                expWindow.textContent += ' ^ ';
            }
            break;
        case '+':
            if (!isNaN(parseInt(lastChar))) {
                expWindow.textContent += ' + ';
            }
            break;
        case '*':
        case '\u00d7'://the multiplication sign's unicode
            if (!isNaN(parseInt(lastChar))) {
                expWindow.textContent += ' \u00d7 ';
            }
            break;
        case '/':
        case '\u00f7'://the division sign's unicode
            if (!isNaN(parseInt(lastChar))) {
                expWindow.textContent += ' \u00f7 ';
            }
            break;
        case '-':
            if (!isNaN(parseInt(lastChar))) {
                expWindow.textContent += ' - ';
            } else if(lastChar === '(' || lastChar === undefined) {
                expWindow.textContent += '-'
            }
            break;
        case '=':
        case 'Enter':
            if(isValidExpression(expWindow.textContent)) {
                expWindow.textContent = evaluate(expWindow.textContent);
                ansWindow.textContent = '';
            } else {
                alert('Invalid Expression');
            };
            break;
        case 'Shift':
            // This is will allow shift to be used for '+ * ^ !' without triggering the default warning for keyboard shortcuts.
            break;
        default:
            break;
    };
    adjustExpressionFont(expLength);
}

function hasDecimalPoint(s) {
    for(let i = s.length-1; i >= 0; i--) {
        if (isNaN(parseInt(s[i])) && s[i] != '.') { return false; };
        if (s[i] === '.') { return true; };
    };
}

function adjustExpressionFont(explen) {
    switch (explen) {
        case 0:
        case 16:
            expWindow.style.fontSize = '35px'; break;
        case 17:
            expWindow.style.fontSize = '30px'; break;
        case 20:
            expWindow.style.fontSize = '25px'; break;
        case 23:
            expWindow.style.fontSize = '20px'; break;
    };
}

function isValidExpression(exprssn) {
    exprssn = exprssn.replaceAll(' ','');
    if(isNaN(exprssn[exprssn.length-1]) && exprssn[exprssn.length-1] != ')') {
        return false
    };
    let leftBRcount = (expWindow.textContent.match(/\(/g) || []).length;
    let rightBRcount = (expWindow.textContent.match(/\)/g) || []).length;
    if (leftBRcount != rightBRcount) { return false };
    return true;
}

function evaluate(exprssn) {
    exprssn = exprssn.replaceAll(' ','');
    // B D M A S
    //Check 1 : Brackets
    //.....
    //Check 2 : Division
    let operatorIndex = 0;
    while(exprssn.includes('\u00f7')) {
        operatorIndex = exprssn.indexOf('\u00f7');
        console.log('exprssn: ',exprssn);
        console.log('operatorIndex: ',operatorIndex);
        let operands = getOperands(exprssn,operatorIndex);
        console.log('operands: ',operands);
        if (operands[1] === 0) {
            alert('Noticed division by zero during calculation! Recheck!');
            return 'undefined';
        }
        let res = divide(operands[0], operands[1]);
        console.log('--> res = ',res);
        let subExprssn = operands[0] + '\u00f7' + operands[1];
        exprssn = exprssn.replace(subExprssn,res);
    };
    //Check 3 : Multiplication
    while(exprssn.includes('\u00d7')) {
        operatorIndex = exprssn.indexOf('\u00d7');
        console.log('exprssn: ',exprssn);
        console.log('operatorIndex: ',operatorIndex);
        let operands = getOperands(exprssn,operatorIndex);
        console.log('operands: ',operands);
        let res = multiply(operands[0], operands[1]);
        console.log('--> res = ',res);
        let subExprssn = operands[0] + '\u00d7' + operands[1];
        exprssn = exprssn.replace(subExprssn,res);
    };
    //Check 4 : Addition (Gather positive numbers)
    let positiveNumberArray = [];
    let negativeNumberArray = [];
    if (exprssn[0] != '-') {//getting first no-sign number from exprssn
        positiveNumberArray.push(getNumber(exprssn,-1));
        exprssn = exprssn.replace(getNumber(exprssn,-1),'');
    };
    while(exprssn.includes('+')) {
        operatorIndex = exprssn.indexOf('+');
        positiveNumberArray.push(getNumber(exprssn,operatorIndex));
        let subExprssn = '+' + positiveNumberArray[positiveNumberArray.length-1];
        exprssn = exprssn.replace(subExprssn,'');
    };
    console.log('positiveNumberArray: ',positiveNumberArray);
    while(exprssn.includes('-')) {
        operatorIndex = exprssn.indexOf('-');
        negativeNumberArray.push(getNumber(exprssn,operatorIndex));
        let subExprssn = '-' + negativeNumberArray[negativeNumberArray.length-1];
        exprssn = exprssn.replace(subExprssn,'');
    };
    console.log('negativeNumberArray: ',negativeNumberArray);
    let result = sumOf(positiveNumberArray) - sumOf(negativeNumberArray);
    console.log('result: ',result);
    exprssn = String(result);
    if (exprssn.includes('.')) {
        exprssn = regulateDecimal(exprssn);
    };
    return exprssn;
}

function getOperands(exprssn, operatorIndex) {
    let leftOperand = '';
    let rightOperand = '';
    let i = operatorIndex - 1;
    let j = operatorIndex + 1;
    while(!isNaN(exprssn[i]) || exprssn[i] === '.') {
        leftOperand = exprssn[i] + leftOperand;
        i--;
    }
    while(!isNaN(exprssn[j]) || exprssn[j] === '.') {
        rightOperand += exprssn[j];
        j++;
    }
    return [parseFloat(leftOperand), parseFloat(rightOperand)];
}

function getNumber(exprssn, indexOfSign) {
    let i = indexOfSign + 1;
    let num = '';
    while(Number.isInteger(parseInt(exprssn[i])) || exprssn[i] === '.') {
        num += exprssn[i];
        i++;
    };
    //console.log('Extracted number: ',num);
    return parseFloat(num);
}

function sumOf(array) {
    return array.reduce((pv, cv) => pv + cv, 0);
}

function regulateDecimal(num) {
    let decimalPointIndex = num.indexOf('.');
    let lenOfDecimal = num.length - decimalPointIndex - 1;
    if (lenOfDecimal > 4) {
        num = String(Math.round(parseFloat(num)*1e5)/1e5);
    };
    return num;
}

calcButtons.forEach(calcButton => calcButton.addEventListener('click', buildExpression));
document.addEventListener('keydown',buildExpression);