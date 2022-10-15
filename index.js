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
        if(btn.className == 'btn numbers'){
            if(document.getElementById('op').innerText == ''){
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
                    let res = operate(document.getElementById('op').innerText,
                    parseFloat(num1span.innerText),
                    parseFloat(num2span.innerText));
                    console.log(document.getElementById('op').innerText);
                    res = Math.round(res * 1e7) / 1e7;
                    if(res > 1e7 || res < 1e-7){
                        res = res.toExponential(7);
                    }
                    document.getElementById('answer').innerText = res;
                };
            };
        } else if(btn.className == 'btn operator'){
            if(num1span.innerText != '' && num2span.innerText == ''){
                document.getElementById('op').innerText = btn.innerText;
            };
        } else if(btn.className == 'btn evaluate'){
            num1span.innerText = document.getElementById('answer').innerText;
            document.getElementById('answer').innerText = '';
            document.getElementById('op').innerText = '';
            num2span.innerText = '';
        } else if(btn.className == 'btn del'){
            let len = 0;
            if(num2span.innerText != ''){
                len = num2span.innerText.length;
                num2span.innerText = num2span.innerText.slice(0,len-1);
                if(num2span.innerText != ''){
                    let res = operate(document.getElementById('op').innerText,
                        parseFloat(num1span.innerText),
                        parseFloat(num2span.innerText));
                    console.log(document.getElementById('op').innerText);
                    res = Math.round(res * 1e7) / 1e7;
                    if(res > 1e7 || res < 1e-7){
                        res = res.toExponential(7);
                    }
                    document.getElementById('answer').innerText = res;
                } else {
                    document.getElementById('answer').innerText = '';
                }
            } else if(document.getElementById('op').innerText != ''){
                document.getElementById('op').innerText = '';
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