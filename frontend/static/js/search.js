export function search(content) {
 let path = window.location.pathname;
     if(path!=='/comment'){

        const searchInput = document.querySelector("[data-search]")

        if (!searchInput) {
            return;
        }

        searchInput.addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase()
            content.forEach(data => {
                const isVisible = data.data.toLowerCase().includes(value)
                if (!isVisible) {
                    data.element.style.display = "none"
                } else {
                    data.element.style.display = "block"
                }
            })
        })
    }
}