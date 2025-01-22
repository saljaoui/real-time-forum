import { createElementWithClass, cleanUp, cleanCards } from '/static/utils/utils.js';
import { createDashboard } from '../main.js'
import { sendNewUserSignUp } from '/static/Components/rightSidebar.js';


// Global user data objects
const userDataSingUp = {
    nickName: '',
    age: NaN,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: ''
}

const userDatalogin = {
    email: '',
    password: '',
}

// Container creation
function createContainer() {
    return createElementWithClass('div', 'container');
}

// Login section creation
function createLoginSection(loginSection) {
    const logo = createElementWithClass('div', 'logo', 'Space');
    loginSection.appendChild(logo);

    const welcomeHeader = createElementWithClass('h1', '', 'Hello, Friend!');
    loginSection.appendChild(welcomeHeader);

    const welcomeText = createElementWithClass('p', 'welcome-text', 'Enter your personal details and start journey with us');
    loginSection.appendChild(welcomeText);

    const signUpBtn = createElementWithClass('button', 'sign-in-btn', 'SIGN UP');
    loginSection.appendChild(signUpBtn);

    return signUpBtn;
}

// Logup section creation
function createLogupSection(loginSection) {
    const logo = createElementWithClass('div', 'logo', 'Space');
    loginSection.appendChild(logo);

    const welcomeHeader = createElementWithClass('h1', '', 'Welcome Back!');
    loginSection.appendChild(welcomeHeader);

    const welcomeText = createElementWithClass('p', 'welcome-text', 'To keep connected with us please login with your personal info');
    loginSection.appendChild(welcomeText);

    const signInBtn = createElementWithClass('button', 'sign-in-btn', 'SIGN IN');
    loginSection.appendChild(signInBtn);

    return signInBtn;
}

// Signin section creation
function createSigninSection(signinSection) {
    const signupHeader = createElementWithClass('h1', 'signup-header', 'Create Account');
    signinSection.appendChild(signupHeader);

    const divider = createElementWithClass('p', 'divider', 'use your email for registration:');
    signinSection.appendChild(divider);

    const form = createSignupForm();
    signinSection.appendChild(form);
}

// Signup section creation
function createSignupSection(signupSection) {
    const signupHeader = createElementWithClass('h1', 'signup-header', 'Sigin In to Space');
    signupSection.appendChild(signupHeader);

    const divider = createElementWithClass('p', 'divider', 'use your nickname for registration:');
    signupSection.appendChild(divider);

    const form = createSigninForm();
    signupSection.appendChild(form);

    return signupSection;
}

// Form creation functions
function createSignupForm() {
    const form = createElementWithClass('form');

    const nickName = createFormGroup('Nickname', 'text', true);
    form.appendChild(nickName);

    const age = createFormGroup('Age', 'number', true);
    form.appendChild(age);

    const firstName = createFormGroup('First Name', 'text', true);
    form.appendChild(firstName);

    const lastName = createFormGroup('Last Name', 'text', true);
    form.appendChild(lastName);

    const genderGroup = createGenderField(true);
    form.appendChild(genderGroup);

    const emailGroup = createFormGroup('Email', 'email', true);
    form.appendChild(emailGroup);

    const passwordGroup = createFormGroup('Password', 'password', true);
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN UP');
    signUpBtn.type = 'submit';
    handleSignUp(signUpBtn, nickName, age, firstName, lastName, emailGroup, passwordGroup, genderGroup);
    form.appendChild(signUpBtn);

    return form;
}

function createSigninForm() {
    const form = createElementWithClass('form');

    const email = createFormGroup('email', 'email', true);
    form.appendChild(email);

    const passwordGroup = createFormGroup('Password', 'password', true);
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN IN');
    signUpBtn.type = 'submit';
    handleLogin(signUpBtn, email, passwordGroup);
    form.appendChild(signUpBtn);

    return form;
}

function createFormGroup(placeholder, type = 'text', required = true) {
    const group = createElementWithClass('div', 'form-group');

    const input = createElementWithClass('input');
    input.type = type;
    input.placeholder = placeholder;
    input.required = required;
    
    // Add specific validation for age input
    if (type === 'number') {
        input.min = 16;
        input.max = 100;
        input.oninput = () => {
            const value = parseInt(input.value);
            if (value < 16 || value > 100) {
                input.setCustomValidity('Age must be between 16 and 100');
            } else {
                input.setCustomValidity('');
            }
        };
    }
    
    group.appendChild(input);
    return group;
}

function createGenderField(required = true) {
    const group = createElementWithClass('div', 'form-group');
    
    const select = createElementWithClass('select');
    select.required = true;  // Make sure the user selects an option
    
    const optionGender = createElementWithClass('option');
    optionGender.textContent = 'Select Gender';
    optionGender.disabled = true;  // Make this option unselectable
    optionGender.selected = true;  // Make this option the default
    select.appendChild(optionGender);
    
    const optionMale = createElementWithClass('option');
    optionMale.value = 'Male';
    optionMale.textContent = 'Male';
    select.appendChild(optionMale);
    
    const optionFemale = createElementWithClass('option');
    optionFemale.value = 'Female';
    optionFemale.textContent = 'Female';
    select.appendChild(optionFemale);

    group.appendChild(select);
    
    return group;
}



function handleLogin(signInBtn, email, passwordGroup) {
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const emailValue = email.querySelector('input').value;
        const passwordValue = passwordGroup.querySelector('input').value;

        if (!emailValue.trim()) {
            showPopup('Email is required');
            return;
        }

        if (!passwordValue.trim()) {
            showPopup('Password is required');
            return;
        }

        userDatalogin.email = emailValue;
        userDatalogin.password = passwordValue;
        fetchDataLogin();
    });
}

function handleSignUp(signUpBtn, nickName, age, firstName, lastName, emailGroup, passwordGroup, genderGroup) {
    signUpBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const formData = {
            nickName: nickName.querySelector('input').value,
            age: age.querySelector('input').value,
            firstName: firstName.querySelector('input').value,
            lastName: lastName.querySelector('input').value,
            email: emailGroup.querySelector('input').value,
            password: passwordGroup.querySelector('input').value,
            gender: genderGroup.querySelector('select').value
        };

        fetchDataSignUp()
        setTimeout (() => {
            sendNewUserSignUp()
        },1000)        
    })
}

// API calls
async function fetchDataSignUp() {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                nickName: userDataSingUp.nickName,
                age: userDataSingUp.age,
                firstname: userDataSingUp.firstName,
                lastname: userDataSingUp.lastName,
                email: userDataSingUp.email,
                password: userDataSingUp.password,
                gender: userDataSingUp.gender
            })
        });
        
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data))
        createDashboard()
    } else {
        const data = await response.json();
        alert(data.message)
    }
}

async function fetchDataLogin() {
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: userDatalogin.email,
                password: userDatalogin.password
            })
        });
        
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data))
        createDashboard()

    } else {
        const data = await response.json();
        alert(data.message)
    }
}

// Toggle functions
function toggleToSignUp(loginSection, signupSection, container) {
    container.classList.add('active');
    loginSection.classList.add('active');
    signupSection.classList.add('active');

    setTimeout(() => {
        cleanUp(loginSection);
        cleanUp(signupSection);

        createSigninSection(signupSection);
        let signInBtn = createLogupSection(loginSection);

        signInBtn.addEventListener('click', () => {
            toggleToSignIn(loginSection, signupSection, container);
        });
    }, 250);
}

function toggleToSignIn(loginSection, signupSection, container) {
    container.classList.remove('active');
    loginSection.classList.remove('active');
    signupSection.classList.remove('active');

    setTimeout(() => {
        cleanUp(loginSection);
        cleanUp(signupSection);

        const signUpBtn = createLoginSection(loginSection);
        createSignupSection(signupSection);

        signUpBtn.addEventListener('click', () => {
            toggleToSignUp(loginSection, signupSection, container);
        });
    }, 250);
}

// Main build function
export function buildLoginPage() {
    
    let loginPage = createElementWithClass('section', 'login-page')
    const container = createContainer();
    const loginSection = createElementWithClass('div', 'login-section');
    const signupSection = createElementWithClass('div', 'signup-section');
    container.appendChild(loginSection);
    container.appendChild(signupSection);
    
    const signUpBtn = createLoginSection(loginSection);
    createSignupSection(signupSection);
    
    loginPage.appendChild(container);
    document.body.appendChild(loginPage)
    
    signUpBtn.addEventListener('click', () => {
        toggleToSignUp(loginSection, signupSection, container);
    });

        let errorContainerP = document.body.querySelector('.error-container p')
        if (errorContainerP.innerHTML != '{{.Message}}') {
            cleanCards('.login-page')
            let errorContainer = document.body.querySelector('.error-container')
            errorContainer.classList.add('show')
        }
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

function validateForm(formData) {
    if (!formData.nickName.trim()) {
        showPopup('Nickname is required');
        return false;
    }
    
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16 || age > 100) {
        showPopup('Age must be between 16 and 100');
        return false;
    }
    
    if (!formData.firstName.trim()) {
        showPopup('First name is required');
        return false;
    }
    
    if (!formData.lastName.trim()) {
        showPopup('Last name is required');
        return false;
    }
    
    if (!formData.gender) {
        showPopup('Please select a gender');
        return false;
    }
    
    if (!formData.email.trim()) {
        showPopup('Email is required');
        return false;
    }
    
    if (!formData.password.trim()) {
        showPopup('Password is required');
        return false;
    }
    
    return true;
}