import { alertPopup } from "./alert.js"
 
let register = document.querySelector("#form-submit")
register.addEventListener('submit', async (e) => {
    e.preventDefault()
    let firstname = document.getElementById('firstname').value
    let lastname = document.getElementById('lastname').value
    let emailRegister = document.getElementById('emailRegister').value
    let passwordRegister = document.getElementById('passwordRegister').value

    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },

        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: emailRegister,
            password: passwordRegister
        })
    })
 
    if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        window.alert("You have register successfuly")
        const userData = {
            firstname: data.message.firstname,
            lastname: data.message.lastname,
            email: data.message.email
        };
        localStorage.setItem("data", JSON.stringify(userData));
        location.href="/home"
     }  else if (response.status === 409 || response.status === 400) {
        const data = await response.json();
        alertPopup(data)
    }else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Error: ${errorData.message || "Request failed"}`);
    }
})