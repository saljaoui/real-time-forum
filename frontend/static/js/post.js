
import { fetchData } from './forum.js';
 import {alertPopup} from './alert.js';

async function creatPost(categoriesSelected) {
         let content = document.querySelector("#content")
        console.log(content.value, categoriesSelected);
        const response = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                title: "title 2",
                content: content.value,
                name: categoriesSelected
            })
        })
        if (response.ok) {
            await fetchData()
            const data = await response.json();
            console.log("Success:", data);

        }else if( response.status === 400) {
            const data = await response.json();
             alertPopup(data)
         }
        //console.log(response);
    
}
export {
    creatPost
}