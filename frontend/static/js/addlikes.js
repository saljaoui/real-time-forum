import {  addLikes, deletLikes } from "./likescomment.js";
import {  fetchCard } from "./createcomment.js";

export function checkandAdd() {
    document.body.addEventListener("click", async (e) => {
        const click = e.target.closest(".action");
         
        if (!click || !click.matches(".is_liked, .disliked")) return; // Ignore unrelated clicks
        e.preventDefault();
        const card_id = click.getAttribute("data-id_card");
        const like = click.getAttribute("data-like");
        const data_liked = click.getAttribute("data-liked");
        try {
            if (like === "like") {
                if (data_liked === "true") {
                    await deletLikes( card_id, click);
                 } else {
                    await addLikes(card_id, 1, true, false, click);
                 }
            } else if (like === "Dislikes") {
                if (data_liked === "true") {
                    await deletLikes(card_id);
                 } else {
                    await addLikes(card_id, -1, false, true, click);
                 }
            }
            await fetchCard(click);
        } catch (error) {
            console.error("Error handling like/dislike:", error);
        }
    });

}
//checkandAdd()