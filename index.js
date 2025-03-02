function getIdsByTaglist(taglist) {
    const idList = new Array;
    for (i in taglist) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${taglist[i]}`)
            .then((res) => {
                if (!res.ok) {
                    console.log("Failed to fetch meals from taglist, perhaps incorrect formatting?");
                    return;
                }
                return res.json();
            }).then((data) => {
                console.log(data)
                for (j in data.meals) {
                    console.log(data.meals[j].idMeal)
                    idList.push(data.meals[j].idMeal)
                }
            })
    }
    return idList;
}

async function getRandomMealId() {
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
    meal = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        ).then((res) => {
            if (!res.ok) {
                console.log("Failed to fetch meals from id, perhaps incorrect formatting?");
                return;
            }
            return res.json();
        }).then((data) => {
            console.log(data);
            return data.meals[0];
        });
    return meal;
}