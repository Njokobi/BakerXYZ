let pageTaglist = [];
let pageMealList = [];

function addToTaglist(tag){
    pageTaglist.push(tag);
}

async function getIdsByTaglist(taglist) {
    const idList = new Array;
    for (i in taglist) {
        console.log(`Fetching: https://www.themealdb.com/api/json/v1/1/filter.php?${taglist[i]}`)
        await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${taglist[i]}`)
            .then((res) => {
                if (!res.ok) {
                    console.log("Failed to fetch meals from taglist, perhaps incorrect formatting?");
                    return;
                }
                return res.json();
            }).then((data) => {
                for (j in data.meals) {
                    idList.push(data.meals[j].idMeal)
                }
            })
    }
    return idList;
}

async function getRandomMealId() {
    console.log(`Fetching: https://www.themealdb.com/api/json/v1/1/random.php`)
    return await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((res) => {
            console.log(res);
            return res.json();
        }).then((data) => {
            meal = data.meals[0];
            return meal.idMeal;
        });
}

async function getMealById(id) {
    console.log(`Fetching: https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let meal = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        ).then((res) => {
            if (!res.ok) {
                console.log("Connection Error");
                return;
            }
            return res.json();
        }).then((data) => {
            console.log(data);
            if(data.meals === "Invalid ID"){
                console.log("Failed to fetch meals from id, perhaps incorrect formatting?");
            }
            return data.meals[0];
        });
    return meal;
}

async function getMealListByIdList(idListPromise){
    let tempList = [];
    let idList = await idListPromise;
    for(i in idList){
        await getMealById(idList[i]).then((meal) => {
            tempList.push(meal);
        });
    }
    return tempList;
}