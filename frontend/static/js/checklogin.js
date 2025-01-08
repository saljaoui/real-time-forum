
async function checklogin() {
    const value = getcookies()
    const token = value[0]
    let is_logout = null
    if (token != null) {
        let aside_nav = document.querySelector(".aside-nav");
        aside_nav.style.display = "block";
        let join = document.querySelector(".join");
        join.style.display = "none";
        while (join.firstChild) {
            join.removeChild(join.firstChild);
        }
        if (window.location.reload) {
            const response = await fetch("/api/isLogged", {
                method: "GET",
            })
            let data = await response.json()
            if (!data) {
                const cookies = document.cookie.split(";");
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i];
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    location.href = "/login"
                }
            }
        }

        is_logout = false
    } else {
        let join = document.querySelector(".join");
        join.style.display = "block";
        let aside_nav = document.querySelector(".aside-nav");
        aside_nav.style.display = "none";
        while (aside_nav.firstChild) {
            aside_nav.removeChild(aside_nav.firstChild);
        }
        let post_comment = document.querySelector(".postReply");
        if (post_comment) {
            post_comment.remove()
        }
        is_logout = true
    }
}

function getcookies() {
    let tokens = document.cookie.split("; ");
    let token = null;
    tokens.forEach((ele) => {
        let [key, value] = ele.split("=");
        if (key === "token") {
            token = value;
        }
    });

    return [token]
}
export {
    checklogin,

}