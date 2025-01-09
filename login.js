function createElementWithClass(type, classNames = '', textContent = '') {
    let element = document.createElement(type);

    if (classNames) {
        element.classList.add(classNames);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

function cleanUp(ele) {
    ele.innerHTML = '';
}

function createContainer() {
    return createElementWithClass('div', 'container');
}

function createLoginSection(loginSection) {
    const logo = createElementWithClass('div', 'logo', 'Diprella');
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
    const logo = createElementWithClass('div', 'logo', 'Diprella');
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
    const signupHeader = createElementWithClass('h1', 'signup-header', 'Sigin In to Diprella');
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

    const emailGroup = createFormGroup('Email', 'email');
    form.appendChild(emailGroup);

    const passwordGroup = createFormGroup('Password', 'password');
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN UP');
    signUpBtn.type = 'submit';
    form.appendChild(signUpBtn);

    return form;
}

function createSigninForm() {
    const form = createElementWithClass('form');

    const nickName = createFormGroup('Nickname');
    form.appendChild(nickName);

    const passwordGroup = createFormGroup('Password', 'password');
    form.appendChild(passwordGroup);

    const signUpBtn = createElementWithClass('button', 'sign-up-btn', 'SIGN IN');
    signUpBtn.type = 'submit';
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

function buildPage() {
    const container = createContainer();
    const loginSection = createElementWithClass('div', 'login-section');
    const signupSection = createElementWithClass('div', 'signup-section');
    container.appendChild(loginSection);
    container.appendChild(signupSection);

    const signUpBtn = createLoginSection(loginSection);
    createSignupSection(signupSection);

    document.body.appendChild(container);

    signUpBtn.addEventListener('click', () => {
        toggleToSignUp(loginSection, signupSection, container);
    });
}

buildPage();