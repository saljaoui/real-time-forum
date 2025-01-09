import { alertPopup } from "./alert.js"
 
let login = document.querySelector("#login")

login.addEventListener('submit', async (e) => {
    e.preventDefault()
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })


    if (response.ok) {
        const data = await response.json();
        const userData = {
            firstname: data.message.firstname,
            lastname: data.message.lastname,
            email: data.message.email
        };
        localStorage.setItem("data", JSON.stringify(userData));
        location.href = "/home"
    }  else if ( response.status === 400) {
        const data = await response.json();
 
        alertPopup(data)
    } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Error: ${errorData.message || "Request failed"}`);
    }

})