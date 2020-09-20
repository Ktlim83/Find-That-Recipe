const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('mealsEl'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');


// Search meal and get from API 
function searchMeal(e) {
    e.preventDefault();
    // Clears the single meal 
    single_mealEl.innerHTML = '';
    // Get search term 
    const term = search.value;
    // Check for empty. if not empty then fetches data from API.
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>This is what we found for '${term}':</h2> `

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There is no recipe available for '${term}'. Try again.</p>`
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                        .join('');
                }
            });
        // Clear search text 
        search.value = '';
    } else {
        alert('Search term needed.')
    }
}

// Fetch Meal by ID 
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        });
}
// Fetch Random Meal by ID 
function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        });
}

// Add meal to DOM
function addMealToDom(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1 class="meal-header">${meal.strMeal}</h1>
        <a href="${meal.strYoutube}"><img src="${meal.strMealThumb}" alt="${meal.strMeal}"/></a>
        <div class="main">
            <p class="mealInstructions">${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
}


// Event Listener   

// Submit searches meals available 
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

// Looks for meal id info
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});