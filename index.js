let pageTaglist = [];
let pageMealList = [];
let mandatoryTagList = [`dessert`, `tart`, `sweet`, `pudding`, `baking`, `pancake`];

function addToTaglist(tag) {
    if (pageTaglist.includes(tag)) {
        pageTaglist.splice(pageTaglist.indexOf(tag));
    } else {
        pageTaglist.push(tag);
    }
    console.log(pageTaglist);
}

async function setPageMealList(mealList) {
    pageMealList = await mealList;
    console.log(pageMealList);
}

async function getIdsByPageTaglist() {
    return await getIdsByTaglist(pageTaglist);
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
        if (data.meals === "Invalid ID") {
            console.log("Failed to fetch meals from id, perhaps incorrect formatting?");
        }
        return data.meals[0];
    });
    return meal;
}

async function getMealListByIdList(idListPromise) {
    let tempList = [];
    let idList = await idListPromise;
    for (i in idList) {
        await getMealById(idList[i]).then((meal) => {
            let isAllowed = false;
            for(j in mandatoryTagList){
                if(meal.strCategory.toLowerCase().includes(mandatoryTagList[j])){
                        isAllowed = true;
                        break;
                } else if(meal.strTags !== null){
                    if(meal.strTags.toLowerCase().includes(mandatoryTagList[j])){
                        isAllowed = true;
                        break;
                    }
                }
            }
            if(!isAllowed){
                return;
            }
            tempList.push(meal);
        });
    }
    return tempList.sort((a, b) => {
        -a.strMeal.toLowerCase().localeCompare(b.strMeal.toLowerCase());
    });
}