import { createComment } from "./createcomment.js"
import { creatPost } from './post.js';
// import { checklogin } from "./checklogin.js";
async function classes() {
    

    if (document.cookie != "") {
        let path = window.location.pathname
        const creategategory = document.querySelector(".postReply")
        const creatPostPopup = document.getElementById('creatPost-popup')//categories-popup
        const post_close = document.querySelector('.post-close')
        const comment = document.querySelector(".create-comment")
        const categoryItems = document.querySelectorAll('.category-item');
        const categories_popup = document.getElementById('categories-popup')
        const newPost = document.querySelector('.newPost-popup')
        const cancel_btn = document.querySelector('.category')
        const openCategories = document.querySelector('.openCategories')
        const create_btn = document.querySelector('.create-post')
        const done_btn = document.querySelector('.done-post')
        const categoriesList = Array.from(document.getElementsByClassName('category-item'))
        let categoriesSelected = []

        if (path === "/comment") {
            newPost.style.display="none"
            openCategories.style.display="none"
            while (categories_popup.firstChild) {
                categories_popup.removeChild(categories_popup.firstChild)
            }
            while (openCategories.firstChild) {
                openCategories.removeChild(openCategories.firstChild)
            }
            comment.addEventListener("click", () => {
                creatPostPopup.style.display = "none"
                createComment(content.value)
                content.value = ""
            })
            creategategory.addEventListener("click", () => {
                create_btn.textContent = "Comment"
                creatPostPopup.style.display = "flex"
            })
            newPost.addEventListener("click", () => {
                creatPostPopup.style.display = "none"
            })
        } else {
            newPost.addEventListener("click", () => {
                creatPostPopup.style.display = "flex"
            })
            openCategories.addEventListener('click', () => {
                categories_popup.style.display = "flex"

            })
            cancel_btn.addEventListener("click", () => {
                closeCategories()
            })

            done_btn.addEventListener("click", () => {
                defaultCategories()
                categoriesList.forEach(category => {
                    if (category.classList.contains('selected')) {
                        categoriesSelected.push(category.textContent)
                    }
                });
            })

            create_btn.addEventListener("click", async () => {
                if (categoriesSelected.length > 0 && content.value.length > 0) {
                    await creatPost(categoriesSelected)
                    creatPostPopup.style.display = "none"
                    closeCategories()
                    content.value = ""

                 //   location.href = "/home"
                } else if (categoriesSelected.length === 0) {
                    categories_popup.style.display = "flex"
                }
            })

            function closeCategories() {
                defaultCategories()
                categoriesList.forEach(category => {
                    if (category.classList.contains('selected')) {
                        category.classList = "category-item"
                    }
                });
            }

            function defaultCategories() {
                categoriesSelected = []
                categories_popup.style.display = "none"
            }

            categoryItems.forEach(item => {
                item.addEventListener('click', () => {
                    item.classList.toggle('selected');
                });
            });
        }

        post_close.addEventListener("click", () => {
            creatPostPopup.style.display = "none"
        })
    } else {

    }
}

await classes() 