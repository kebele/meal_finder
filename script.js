


/* A SPECIAL THANKS TO TRAVERSY MEDIA */





const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random'),
mealsEl = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'), 
single_mealEl = document.getElementById('single-meal');

const cevir = document.getElementById('cevir');
const ceviriBas = document.getElementById('ceviri-bas');
const video = document.getElementById('video');
const dilSecEl = document.getElementById('dilsec');

//dil seçmek için
function dilSec(){
    console.log(dilSecEl.value);
}

//ceviri için
async function ceviriYap(e){
    // console.log("ceviri yap");
    e.preventDefault();
    // console.log(search.value);
    const baseUrl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
    const apiKey = "trnsl.1.1.20200216T202741Z.b1db3e1a124036e8.40cabf0d744bc86212f77547f02ceb5c26086076";
    const lang = "en-tr";

    const tarif = single_mealEl.childNodes[1].childNodes[7].innerText;
    // console.log(tarif);

    const url = `${baseUrl}?key=${apiKey}&lang=${lang}&text=${tarif}`;
    const responseTranslate = await fetch(url);
    const dataTranslate = await responseTranslate.json();
    
    // return dataTranslate.text[0];
// console.log(dataTranslate.text[0]);
ceviriBas.innerText = dataTranslate.text[0];

    // search.value = '';
}


//video için
function videoGoster(){
    return true;
}


//search meal and fetch from API
function searchMeal(e){
    e.preventDefault();


    //clear single meal
    single_mealEl.innerHTML = '';

    //get the search term
    const term = search.value;

    //check for empty
    if(term.trim()){
        //trim() boşluk var mı diye kontrol eder, yani bomboş olması durumu
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                 console.log(data);
                resultHeading.innerHTML = `<h2>search result for '${term}' :</h2>`

                if(data.meals === null){
                    resultHeading.innerHTML = `<p>there are no search result.</p>
                    <p>Try Again!</p>`
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
            //clear search text
            search.value = '';
    } else {
        alert('please enter a search term')
    }

    console.log(term);
}

//fetch meal by ID
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            const meal = data.meals[0];

            addMealtoDOM(meal)
        })
}

//fetch random meal from API
function getRandomMeal(){
    //clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal =  data.meals[0];

            addMealtoDOM(meal);
        })
}


//add meal to DOM
function addMealtoDOM(meal){
    const ingredients = [];

    for(let i = 1; i <=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    // const videoLink = "https://www.youtube.com/watch?v=oTw5tPt4KmA";
    const videoLink = meal.strYoutube;
    
    const yeniLink = videoLink.replace("watch?v=", "embed/");

console.log(yeniLink);
    // console.log(videoLink);
    // console.log(yeniLink);
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` :  ''} 
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingre => `<li>${ingre}</li>
                    `).join('')}
                </ul>
                
                <iframe width="560" height="315"
                    src=${yeniLink}>
                </iframe>                
            </div>
        </div>
    `;
}


//event listeners
random.addEventListener('click', getRandomMeal);
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(x => {
        // console.log(x);
        if(x.classList){
            return x.classList.contains('meal-info')
        } else {
            return false;
        }
    });
    // console.log(mealInfo);
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        // console.log(mealID);
        getMealById(mealID);
    }
})

cevir.addEventListener('click', ceviriYap);

