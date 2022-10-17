function operate(operator,num1,num2){
    switch (operator) {
        case '+':
            return (num1+num2);
        case '-':
            return (num1-num2);
        case '\u00d7':
            return (num1*num2);
        case '\u00f7':
            return (num1/num2);
        case '^':
            return (num1**num2);
    }
}

let btn_arr = document.getElementsByClassName('btn');
for(let btn of btn_arr) {
    btn.addEventListener('click',()=>{
        let num1span = document.getElementById('num1');
        let num2span = document.getElementById('num2');
        let opspan = document.getElementById('op');
        if(btn.className == 'btn numbers'){
            if(opspan.innerText == ''){
                if(btn.innerText == '.' && num1span.innerText.includes('.')){
                    //pass
                } else {
                    num1span.innerText += btn.innerText;
                };
            } else {
                if(btn.innerText == '.' && num2span.innerText.includes('.')){
                    //pass
                } else {
                    num2span.innerText += btn.innerText;
                    let res = operate(opspan.innerText,
                    parseFloat(num1span.innerText),
                    parseFloat(num2span.innerText));
                    res = Math.round(res * 1e7) / 1e7;
                    if(res > 1e7 || (res < 1e-7 && res > -1e-7)){
                        res = res.toExponential(7);
                    }
                    document.getElementById('answer').innerText = res;
                };
            };
        } else if(btn.className == 'btn operator'){
            if(btn.innerText == '-'){
                if(num1span.innerText == ''){
                    num1span.innerText += '-';
                }else if(opspan.innerText == '^' && num2span.innerText == ''){
                    num2span.innerText += '-';
                } else {
                    opspan.innerText = '-';
                }
            } else if(num1span.innerText != '' && num2span.innerText == ''){
                opspan.innerText = btn.innerText;
            };
        } else if(btn.className == 'btn evaluate'){
            if(num2span.innerText != ''){
                num1span.innerText = document.getElementById('answer').innerText;
                document.getElementById('answer').innerText = '';
                opspan.innerText = '';
                num2span.innerText = '';
            }
        } else if(btn.className == 'btn del'){
            let len = 0;
            if(num2span.innerText != ''){
                len = num2span.innerText.length;
                num2span.innerText = num2span.innerText.slice(0,len-1);
                if(num2span.innerText != ''){
                    let res = operate(opspan.innerText,
                        parseFloat(num1span.innerText),
                        parseFloat(num2span.innerText));
                    res = Math.round(res * 1e7) / 1e7;
                    if(res > 1e7 || (res < 1e-7 && res > -1e-7)){
                        res = res.toExponential(7);
                    }
                    document.getElementById('answer').innerText = res;
                } else {
                    document.getElementById('answer').innerText = '';
                }
            } else if(opspan.innerText != ''){
                opspan.innerText = '';
            } else if(num1span.innerText != ''){
                len = num1span.innerText.length;
                num1span.innerText = num1span.innerText.slice(0,len-1);
            };
        };
    });
}

document.getElementById('clearAll').addEventListener('click',()=>{
    document.getElementById('num1').innerText = '';
    document.getElementById('op').innerText = '';
    document.getElementById('num2').innerText = '';
    document.getElementById('answer').innerText = '';
})