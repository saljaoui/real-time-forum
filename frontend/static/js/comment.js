import { InitialComment } from "./createcomment.js"
import { checklogin } from "./checklogin.js";

import { alertPopup } from "./alert.js";
await checklogin()
const urlParams = new URLSearchParams(window.location.search);
const cardData = urlParams.get("card_id");

async function fetchdata() {
    let fullname = document.querySelector(".full-name")
    let content = document.querySelector(".content")
    let time = document.querySelector(".time")
    let username = document.querySelector(".username")
    let cards = document.querySelectorAll("#likes")
    let is_liked = document.querySelector("#is_liked")
    let is_Dislikes = document.querySelector("#is_Dislikes")
    let comments = document.querySelector(".comments")
    let data = ""
    let path = window.location.pathname

    if (path !== "/comment") {
        return ""
    } else {
        const response = await fetch(`/api/card?id=${cardData}`, {
            method: "GET",
        })
        if (response.ok) {
            data = await response.json();
            fullname.textContent = data.lastName + " " + data.firstName
            content.textContent = data.content
            username.textContent = data.lastName
            is_liked.textContent = data.likes
            is_Dislikes.textContent = data.dislikes
            comments.textContent = data.comments
            cards.forEach(async (card) => {
                card.setAttribute("data-id_card", data.id)
            })
        }  else if( response.status === 409 || response.status === 400) {
             const data = await response.json();
              alertPopup(data)
          }

    }
}
await fetchdata()
async function GetComments() {
    let path = window.location.pathname
    if (path !== "/comment") {

        return ""
    } else {
        const response = await fetch(`/api/comment?target_id=${cardData}`, {
            method: "GET",
        });

        if (response.ok) {
            let textResponse = await response.text();
            if (textResponse.trim() === "") {
                console.log("Empty response body");
                return;
            } 
                let datacomment = JSON.parse(textResponse); // Manually parse JSON
                 let comments = document.querySelector(".allcomment");
                comments.innerHTML = "";
             await   InitialComment(datacomment, comments);
            

        } else if(   response.status === 400) {
            const data = await response.json();
             alertPopup(data)
             
         } 
        else {
            console.log("err");
        }
    }
}
await GetComments()
export {
    GetComments
}