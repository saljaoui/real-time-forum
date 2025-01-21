import { createElementWithClass, cleanUp } from '/static/utils/utils.js';
import { createDashboard } from '../main.js'

const userDataSingUp = {
    nickName: '',
    age: NaN,
    firstName : '',
    lastName: '',
    email: '',
    password: '',
    gender: ''
}

const userDatalogin = {
    email: '',
    password: '',
}

function createContainer() {
    return createElementWithClass('div', 'container');
}

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

function createSigninSection(signinSection) {
    const signupHeader = createElementWithClass('h1', 'signup-header', 'Create Account');
    signinSection.appendChild(signupHeader);

    const divider = createElementWithClass('p', 'divider', 'use your email for registration:');
    signinSection.appendChild(divider);

    const form = createSignupForm();
    signinSection.appendChild(form);
}

function createSignupSection(signupSection) {
    const signupHeader = createElementWithClass('h1', 'signup-header', 'Sigin In to Space');
    signupSection.appendChild(signupHeader);

    const divider = createElementWithClass('p', 'divider', 'use your nickname for registration:');
    signupSection.appendChild(divider);

    const form = createSigninForm();
    signupSection.appendChild(form);

    return signupSection;
}

function createSignupForm() {
    const form = createElementWithClass('form');

    const nickName = createFormGroup('Nickname');
    form.appendChild(nickName);

    const age = createFormGroup('Age');
    form.appendChild(age);

    const firstName = createFormGroup('First Name');
    form.appendChild(firstName);

    const lastName = createFormGroup('Last Name');
    form.appendChild(lastName);

    const genderGroup = createGenderField();
    form.appendChild(genderGroup);

    const emailGroup = createFormGroup('Email', 'email');
    form.appendChild(emailGroup);

    const passwordGroup = createFormGroup('Password', 'password');
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN UP');
    signUpBtn.type = 'submit';
    handleSignUp(signUpBtn, nickName, age, firstName, lastName, emailGroup, passwordGroup, genderGroup);
    form.appendChild(signUpBtn);

    return form;
}

function createGenderField() {
    const group = createElementWithClass('div', 'form-group');
    
    const select = createElementWithClass('select');

    const optionGender = createElementWithClass('option');
    optionGender.textContent = 'Select Gender';
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

        userDatalogin.email = email.querySelector('input').value;
        userDatalogin.password = passwordGroup.querySelector('input').value;

        fetchDataLogin()

    })
}


function handleSignUp(signUpBtn, nickName, age, firstName, lastName, emailGroup, passwordGroup, genderGroup) {

    signUpBtn.addEventListener('click', (e) => {
        e.preventDefault();

        userDataSingUp.nickName = nickName.querySelector('input').value;
        userDataSingUp.age = age.querySelector('input').value;
        userDataSingUp.firstName = firstName.querySelector('input').value;
        userDataSingUp.lastName = lastName.querySelector('input').value;
        userDataSingUp.email = emailGroup.querySelector('input').value;
        userDataSingUp.password = passwordGroup.querySelector('input').value;
        userDataSingUp.gender = genderGroup.querySelector('select').value;

        fetchDataSignUp()

    })
}

async function fetchDataSignUp() {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },

        body: JSON.stringify({
            nickName: userDataSingUp.nickName,
            age: userDataSingUp.age,
            firstname: userDataSingUp.firstName ,
            lastname: userDataSingUp.lastName,
            email: userDataSingUp.email,
            password: userDataSingUp.password,
            gender: userDataSingUp.gender
        })
    })
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data))
        createDashboard()
    }
}

async function fetchDataLogin() {
    
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
    })
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data))
        createDashboard()

    }
}

function createSigninForm() {
    const form = createElementWithClass('form');

    const email = createFormGroup('email');
    form.appendChild(email);

    const passwordGroup = createFormGroup('Password', 'password');
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN IN');
    signUpBtn.type = 'submit';
    handleLogin(signUpBtn, email, passwordGroup);
    form.appendChild(signUpBtn);

    return form;
}

function createFormGroup(placeholder, type = 'text') {
    const group = createElementWithClass('div', 'form-group');

    const input = createElementWithClass('input');
    input.type = type;
    input.placeholder = placeholder;
    group.appendChild(input);

    return group;
}

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
}
