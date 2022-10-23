const calcButtons = document.querySelectorAll('.btn');
let expWindow = document.querySelector('#expression');
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
            break;
        case '.':
            if (!hasDecimalPoint(expWindow.textContent)) {
                expWindow.textContent += '.';
            }
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
            if (isValidExpression()) {
                expWindow.textContent = evaluate(expWindow.textContent.replace(' ',''));
            } else {
                alert('Invalid Expression!')
            }
            break;
        case 'Shift':
            // This is will allow shift to be used for '+ * ^ !' without triggering the default warning for keyboard shortcuts.
            break;
        default:
            break;
    }
    adjustExpressionFont(expLength);
    ansWindow.textContent = evaluate(expWindow.textContent.replace(' ',''));
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

function isValidExpression() {
    let leftBRcount = (expWindow.textContent.match(/\(/g) || []).length;
    let rightBRcount = (expWindow.textContent.match(/\)/g) || []).length;
    return (leftBRcount == rightBRcount);
}

function evaluate(exprssn) {
    // B O D M A S
    //Check 1 : Brackets
    //.....
    //Check 2 : Division
    let operatorIndex = 0;
    while(exprssn.includes('\u00f7')) {
        operatorIndex = exprssn.indexOf('\u00f7');
        let numbers = getNumbers(exprssn,operatorIndex);
        let res = divide(numbers[0], numbers[1]);
        let subExprssn = numbers[0] + '\u00f7' + numbers[1];
        exprssn = exprssn.replace(subExprssn,'');
    }
    return exprssn;
}

function getNumbers(exprssn, operatorIndex) {
    let leftNumber = '';
    let rightNumber = '';
    let i = operatorIndex - 1;
    let j = operatorIndex + 1;
    while(!isNaN(exprssn[i]) || exprssn[i] === '.') {
        leftNumber = exprssn[i] + leftNumber;
        i--;
    }
    while(!isNaN(exprssn[i]) || exprssn[i] === '.') {
        rightNumber += exprssn[i];
        j++;
    }
    return [parseFloat(leftNumber), parseFloat(rightNumber)];
}

calcButtons.forEach(calcButton => calcButton.addEventListener('click', buildExpression));
document.addEventListener('keydown',buildExpression);