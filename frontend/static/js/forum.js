import { likes } from "./likescomment.js";
import { cards } from "./card.js";
import { search } from "./search.js";

import { alertPopup } from "./alert.js";
let content = []
export async function fetchData() {
  const response = await fetch(`/api/home`, {
    method: "GET",
  });
  if (response.ok) {
    let path = window.location.pathname
    if (path !== "/profile") {
      let data = await response.json();
      
      let user_info = document.querySelector(".main");
      content = cards(data.posts, user_info)

      let like = document.querySelectorAll("#likes");
      likes(like)
      search(content)

    }
  } else if ( response.status === 400) {
    const data = await response.json();
    alertPopup(data)
  }


}
await fetchData()


function renderPagination(data, container) {

  let path = window.location.pathname;
  if (path !== '/comment' && path !== '/settings') {
    let paginationDiv = document.querySelector('.pagination-controls');
    if (!paginationDiv) {
      paginationDiv = document.createElement('div');
      paginationDiv.className = 'pagination-controls';
      container.appendChild(paginationDiv);
    }

  }
}
// Make fetchData available globally
window.fetchData = fetchData;

