
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".GenerateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const sysmbol = '!@#$%^&*()_+/*?":><}{';

let password = "";
var passwordlength = 10;
let checkCount = 0;

handleSlider();
function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return String.fromCharCode(getRndInteger(48, 58)); // ASCII codes for 0-9
}

function genertelowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateuppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generatesymbol() {
    const randNum = getRndInteger(0, sysmbol.length);
    return sysmbol.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordlength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener("click", () => {
    if (checkCount <= 0) {
        return;
    }
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
    password = "";
    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateuppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(genertelowercase);
    } 
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generatesymbol);
    }
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
