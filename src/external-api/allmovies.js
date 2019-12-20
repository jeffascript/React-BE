const fetch = require("node-fetch")



//     // http://www.omdbapi.com/?apikey=df0f1fae&i=tt0848228



const FetchAllMovies = async(imdb) => {
    let URL = "http://www.omdbapi.com/?apikey=df0f1fae&s=".concat(imdb);
    try{
        let response = await fetch (URL,{
            method: "GET"

        })
        if(response.ok){
        return await response.json()
         }

    }

    catch (error){
        console.log("There is something wrong with fetching the data from API", error)
    }


}
 
module.exports = FetchAllMovies;