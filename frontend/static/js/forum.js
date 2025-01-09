import { likes } from "./likescomment.js";
import { cards } from "./card.js";
import { search } from "./search.js";

import { alertPopup } from "./alert.js";
let content = []
export async function fetchData(page = 1) {
  const response = await fetch(`/api/home?page=${page}`, {
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
      renderPagination(data, user_info);
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

    let paginationHTML = '';

    // Previous button
    if (data.currentPage > 1) {
      paginationHTML += `
      <button onclick="window.fetchData(${data.currentPage - 1})" class="pagination-btn">
        Previous
      </button>
    `;
    }

    // Page numbers
    for (let i = 1; i <= data.totalPages; i++) {
      paginationHTML += `
      <button 
        onclick="window.fetchData(${i})" 
        class="pagination-btn ${i === data.currentPage ? 'active' : ''}"
      >
        ${i}
      </button>
    `;
    }

    // Next button
    if (data.currentPage < data.totalPages) {
      paginationHTML += `
      <button onclick="window.fetchData(${data.currentPage + 1})" class="pagination-btn">
        Next
      </button>
    `;
    }
    paginationDiv.innerHTML = paginationHTML;
  }
}
// Make fetchData available globally
window.fetchData = fetchData;

