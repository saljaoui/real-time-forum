import { createElementWithClass } from '/static/utils/utils.js';
import { fetchCategoriesData } from '../main.js'

export function createCategories() {

    const filterCategories = createElementWithClass('div', 'filter-categories');
    const categoriesContent = createElementWithClass('div', 'categories-content');
    const categoriesList = createElementWithClass('div', 'categories-list active');

    const categories = [
        'General', 'Technology', 'Sports', 'Entertainment', 'Science',
        'Health', 'Food', 'Travel', 'Fashion', 'Art', 'Music'
    ];

    categories.forEach(category => {
        const categoryItem = createElementWithClass('div', 'category-item', category);
        if (category === 'General') { categoryItem.classList.add('selected') }
        categoriesList.appendChild(categoryItem);
        categoriesItemsEvent(categoryItem, categoriesList)
    });

    fetchCategoriesData('General')

    const titleCategories = createElementWithClass('div', 'title-categories', 'Filter by Categories:');

    categoriesContent.appendChild(categoriesList);
    filterCategories.appendChild(titleCategories)
    filterCategories.appendChild(categoriesContent)

    return filterCategories
}

function categoriesItemsEvent(categorieItem, categorieList) {
    categorieItem.addEventListener('click', () => {
        categorieList.querySelectorAll('.category-item').forEach(categorieItem => {
            categorieItem.classList.remove('selected');
        });
        categorieItem.classList.add('selected');
        fetchCategoriesData(categorieItem.textContent)
    });
}

