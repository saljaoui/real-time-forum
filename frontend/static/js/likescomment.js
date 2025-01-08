import { alertPopup } from "./alert.js";

export function likes(likeElements) {
    if (document.cookie != "") {

        likeElements.forEach(async (click) => {
            let card_id = click.getAttribute("data-id_card");
            let like = click.getAttribute("data-like");
            const response = await fetch("api/likes", {
                method: "POST",
                body: JSON.stringify({ card_id: +card_id }),
            });
            if (response.ok) {
                let data = await response.json();
                data.forEach((el) => {
                    let tokens = document.cookie.split("token=")
                    if (el.Uuid === tokens[1]) {
                        localStorage.setItem("user_login", el.User_id);
                        if (el.UserLiked && like === "like") {
                            click.classList.add("clicked");
                            click.setAttribute("data-liked", "true");
                        } else if (el.UserDisliked && like === "Dislikes") {
                            click.classList.add("clicked_disliked");
                            click.setAttribute("data-liked", "true");
                        }
                    }
                });
            } else if (!response.ok) {
                await status(response)
            }
        });
    }
}

export async function addLikes(card_id, liked, lik, dislk, click) {
    try {
        if (document.cookie != "") {
            let response = await fetch("/api/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    is_liked: +liked,
                    card_id: +card_id,
                    UserLiked: lik,
                    Userdisliked: dislk,
                }),
            });
            if (response.status === 400) {
                const data = await response.json();
                alertPopup(data)
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export async function deletLikes(card_id) {
    try {
        if (document.cookie != "") {


            let response = await fetch("/api/deleted", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ card_id: +card_id }),
            });
 
            if (response.status === 400) {
                const data = await response.json();
                alertPopup(data)
            }
        }
    } catch (error) {

    }
}
