const calcButtons = document.querySelectorAll('.btn');
let expWindow = document.getElementById('expression');
let ansWindow = document.querySelector('#answer');

function add(num1, num2) {
    return (num1 + num2);
}
function subtract(num1, num2) {
    return (num1 - num2);
}
function multiply(num1, num2) {
    return (num1 * num2);
}
function divide(num1, num2) {
    return (num1 / num2);
}
function power(num1, num2) {
    return (num1 ** num2);
}

function buildExpression(e) {
    let data = '';
    let expLength = expWindow.textContent.length;
    let lastChar = expWindow.textContent[expLength - 1];
    if (e.key === undefined) {
        data = e.target.textContent;
    } else {
        data = e.key;
    }
    //console.log(data);
    switch (data) {
        case '0':
            if (expWindow.textContent[expLength - 2] === '\u00f7') {
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
                expWindow.textContent = expWindow.textContent.slice(0, -3);
            } else {
                expWindow.textContent = expWindow.textContent.slice(0, -1);
            };
            if (isValidExpression(expWindow.textContent)
                && expWindow.textContent.includes(' ')) {
                ansWindow.textContent = evaluate(expWindow.textContent);
            } else {
                ansWindow.textContent = '';
            };
            break;
        case '^':
        case 'x y':
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ' ^ ';
            }
            break;
        case '+':
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ' + ';
            }
            break;
        case '*':
        case '\u00d7'://the multiplication sign's unicode
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ' \u00d7 ';
            }
            break;
        case '/':
        case '\u00f7'://the division sign's unicode
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ' \u00f7 ';
            }
            break;
        case '-':
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ' - ';
            } else if (lastChar === '(' || lastChar === undefined) {
                expWindow.textContent += '-'
            }
            break;
        case '(\u2002)'://brackets separated by &ensp; (unicode: u+2002)
            if (lastChar === undefined || lastChar === ' ' || lastChar === '(') {
                expWindow.textContent += '(';
            };
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ')';
                if (isValidExpression(expWindow.textContent)
                    && expWindow.textContent.includes(' ')) {
                    ansWindow.textContent = evaluate(expWindow.textContent);
                } else {
                    ansWindow.textContent = '';
                };
            };
            break;
        case '('://keyboard input support
            if (lastChar === undefined || lastChar === ' ' || lastChar === '(') {
                expWindow.textContent += '(';
            };
            break;
        case ')'://keyboard input support
            if (!isNaN(parseInt(lastChar)) || lastChar === ')') {
                expWindow.textContent += ')';
                if (isValidExpression(expWindow.textContent)
                    && expWindow.textContent.includes(' ')) {
                    ansWindow.textContent = evaluate(expWindow.textContent);
                } else {
                    ansWindow.textContent = '';
                };
            };
            break;
        case '=':
        case 'Enter':
            if (isValidExpression(expWindow.textContent)) {
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
    adjustExpressionFont(expWindow.textContent.length);
}

function hasDecimalPoint(s) {
    for (let i = s.length - 1; i >= 0; i--) {
        if (isNaN(parseInt(s[i])) && s[i] != '.') { return false; };
        if (s[i] === '.') { return true; };
    };
}

function adjustExpressionFont(explen) {
    if (explen > 0 && explen < 19) {
        expWindow.style.fontSize = '35px';
    }
    switch (explen) {
        case 19:
            expWindow.style.fontSize = '30px'; break;
        case 22:
            expWindow.style.fontSize = '25px'; break;
        case 25:
            expWindow.style.fontSize = '20px'; break;
    };
}

function isValidExpression(exprssn) {
    exprssn = exprssn.replaceAll(' ', '');
    if (isNaN(exprssn[exprssn.length - 1]) && exprssn[exprssn.length - 1] != ')') {
        return false
    };
    let leftBRcount = (expWindow.textContent.match(/\(/g) || []).length;
    let rightBRcount = (expWindow.textContent.match(/\)/g) || []).length;
    if (leftBRcount != rightBRcount) { return false };
    return true;
}

function evaluate(exprssn) {
    exprssn = exprssn.replaceAll(' ', '');
    let closeBracketIndex = 0;
    let openBracketIndex = 0;
    let subExp = '';
    let resultOfSubExp = '';
    while (exprssn.includes(')')) {
        closeBracketIndex = exprssn.indexOf(')');
        for (let i = closeBracketIndex; i >= 0; i--) {
            if (exprssn[i] === '(') {
                openBracketIndex = i;
                break;
            };
        };
        subExp = exprssn.slice(openBracketIndex + 1, closeBracketIndex);
        resultOfSubExp = evaluateSubExp(subExp);
        if (resultOfSubExp[0] === '-' && exprssn[openBracketIndex - 1] === '-') {
            exprssn = exprssn.replace(('-(' + subExp + ')'), ('+' + resultOfSubExp.slice(1)));
        } else if (resultOfSubExp[0] === '-' && exprssn[openBracketIndex - 1] === '+') {
            exprssn = exprssn.replace(('+(' + subExp + ')'), (resultOfSubExp));
        } else {
            exprssn = exprssn.replace(('(' + subExp + ')'), resultOfSubExp);
        }
    };
    console.log('reducedExp: ', exprssn);
    return evaluateSubExp(exprssn);
}

function evaluateSubExp(exprssn) {
    exprssn = exprssn.replaceAll(' ', '');
    let operatorIndex = 0;
    // B D M A S
    //Check 1 : Brackets
    //.....
    //Check 1.5 : Exponent/Power
    while (exprssn.includes('^')) {
        operatorIndex = exprssn.indexOf('^');
        //console.log('exprssn: ',exprssn);
        //console.log('operatorIndex: ',operatorIndex);
        let operands = getOperands(exprssn, operatorIndex);
        //console.log('operands: ',operands);
        let res = power(operands[0], operands[1]);
        //console.log('--> res = ',res);
        let subExprssn = operands[0] + '^' + operands[1];
        exprssn = exprssn.replace(subExprssn, res);
    };
    //Check 2 : Division
    while (exprssn.includes('\u00f7')) {
        operatorIndex = exprssn.indexOf('\u00f7');
        //console.log('exprssn: ',exprssn);
        //console.log('operatorIndex: ',operatorIndex);
        let operands = getOperands(exprssn, operatorIndex);
        //console.log('operands: ',operands);
        if (operands[1] === 0) {
            alert('Noticed division by zero during calculation! Recheck!');
            return 'undefined';
        }
        let res = divide(operands[0], operands[1]);
        //console.log('--> res = ',res);
        let subExprssn = operands[0] + '\u00f7' + operands[1];
        exprssn = exprssn.replace(subExprssn, `(${res})`);
        return evaluate(exprssn);
    };
    //Check 3 : Multiplication
    while (exprssn.includes('\u00d7')) {
        operatorIndex = exprssn.indexOf('\u00d7');
        //console.log('exprssn: ',exprssn);
        //console.log('operatorIndex: ',operatorIndex);
        let operands = getOperands(exprssn, operatorIndex);
        // console.log('operands: ',operands);
        let res = multiply(operands[0], operands[1]);
        // console.log('--> res = ',res);
        let subExprssn = operands[0] + '\u00d7' + operands[1];
        exprssn = exprssn.replace(subExprssn, `(${res})`);
        // console.log(`exprssn: ${exprssn}`);
        return evaluate(exprssn);
    };
    //Check 4,5 : Addition and Subtraction (Gather positive and negative numbers)
    let positiveNumberArray = [];
    let negativeNumberArray = [];
    if (exprssn[0] !== '-') {//getting first no-sign number from exprssn
        positiveNumberArray.push(getNumber(exprssn, -1));
        exprssn = exprssn.replace(getNumber(exprssn, -1), '');
    };
    while (exprssn.includes('+')) {
        operatorIndex = exprssn.indexOf('+');
        positiveNumberArray.push(getNumber(exprssn, operatorIndex));
        let subExprssn = '+' + positiveNumberArray[positiveNumberArray.length - 1];
        exprssn = exprssn.replace(subExprssn, '');
    };
    console.log('positiveNumberArray: ', positiveNumberArray);
    while (exprssn.includes('-')) {
        operatorIndex = exprssn.indexOf('-');
        negativeNumberArray.push(getNumber(exprssn, operatorIndex));
        let subExprssn = '-' + negativeNumberArray[negativeNumberArray.length - 1];
        exprssn = exprssn.replace(subExprssn, '');
    };
    console.log('negativeNumberArray: ', negativeNumberArray);
    let result = sumOf(positiveNumberArray) - sumOf(negativeNumberArray);
    console.log('resultOfSubExp: ', result);
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
    while (!isNaN(exprssn[i]) || exprssn[i] === '.'
        || (exprssn[i] === '-' && exprssn[i - 1] === undefined)) {
        leftOperand = exprssn[i] + leftOperand;
        i--;
    }
    while (!isNaN(exprssn[j]) || exprssn[j] === '.' || exprssn[j] === '-') {
        rightOperand += exprssn[j];
        j++;
    }
    return [parseFloat(leftOperand), parseFloat(rightOperand)];
}

function getNumber(exprssn, indexOfSign) {
    let i = indexOfSign + 1;
    let num = '';
    while (Number.isInteger(parseInt(exprssn[i])) || exprssn[i] === '.') {
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
        num = String(Math.round(parseFloat(num) * 1e7) / 1e7);
    };
    return num;
}

calcButtons.forEach(calcButton => calcButton.addEventListener('click', buildExpression));
document.addEventListener('keydown', buildExpression);