export function createElementWithClass(type, classNames = '', textContent = '') {
    let element = document.createElement(type);
    if (classNames) element.classList.add(...classNames.split(' '));
    if (textContent) element.textContent = textContent;
    return element;
}

export function cleanUp(ele) {
    ele.innerHTML = '';
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split('=');
      if (key === name) {
          return value;
      }
  }
  return null;
}


export function cleanCards(CardName) {
  let posts = document.querySelectorAll(CardName)
  posts.forEach(post => {
      post.remove()
  })
}

export function getTimeDifferenceInHours(createdAt) {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffInMilliseconds = now - createdTime;
    let diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      return diffInMinutes < 1 ? "just now" : diffInMinutes + " minutes ago";
    }
    if (diffInHours > 24) {
      return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + " days ago";
    }
    return diffInHours + " hours ago";
  }

// Chcek if user if already logged
export async function handleAuthCheck() {
    const response = await fetch(`/api/auth`, {
        method: "GET",
      });
      if (response.ok) {
          let data = await response.json();
          return data
      }
}