import { alertPopup } from "./alert.js";


const LogoutItem = document.querySelector(".signOut");

export default async function logout() {

    let Useruuid = getCookie("token");
 
    
    const response = await fetch("http://localhost:3333/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid: Useruuid }),
    });
    
    if (response.ok) {
        console.log("Logout successful");
        window.location.href = "/login";
    } else if (response.status === 409 || response.status === 400) {
        const data = await response.json();
        alertPopup(data)
    } 
}

if (LogoutItem) {
    LogoutItem.addEventListener("click", () => {
        logout();
    });
} else {
    console.error("Logout button not found");
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}
