/*
    Portfolio Challenge: Netflix

    You are creating the API for your Netfix App

    Each Media in you App has these info:

    {
        "Title": "The Lord of the Rings: The Fellowship of the Ring",
        "Year": "2001",
        "imdbID": "tt0120737",  //UNIQUE
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
    }

    And the reviews looks like:

    {
        "_id": "123455", //SERVER GENERATED
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
        "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
        "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
    }


    //BACKEND

    You are in charge of building the Backend using NodeJS + Express. 
    The backend should include the extra following features:

    CRUD for Media ( /media GET, POST, DELETE, PUT)
    CRUD for Reviews ( /reviews GET, POST, DELETE, PUT)
    Extra method for media's image upload (POST /media/{id}/upload)

    Add an extra method to get all the reviews of a specific media (GET /media/{id}/reviews)
    
    ** also did POST from there



    
    [EXTRA] GET /media/:id should fetch the information from omdbapi (DONE)


    [EXTRA] POST /media/catalogue?title=whatever should return a PDF containing all the movies containing the given word in the title
    [EXTRA] GET /media?title=book => should return media with title containing "book" (must be possible to filter also for year and type)
    [EXTRA] GET /media should return the movies sorted by the Avg Rate value
    [EXTRA] POST /media/sendCatalogue?title=whatever&email=my@email.com should send and email with the catalogue that match the title to the given address

    //FRONTEND

    Connect this app to your Netflix App.
    The user should be able to surf movies (remember you have to use http://www.omdbapi.com/ to get details when the user enters a movie)

    //DEPLOY

    Both client and server App should be deployed on your Heroku account.

    // SAMPLE DATA:

    [
    {
        "Title": "The Lord of the Rings: The Fellowship of the Ring",
        "Year": "2001",
        "imdbID": "tt0120737",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg"
    },
    {
        "Title": "The Lord of the Rings: The Return of the King",
        "Year": "2003",
        "imdbID": "tt0167260",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
        "Title": "The Lord of the Rings: The Two Towers",
        "Year": "2002",
        "imdbID": "tt0167261",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNGE5MzIyNTAtNWFlMC00NDA2LWJiMjItMjc4Yjg1OWM5NzhhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
        "Title": "Lord of War",
        "Year": "2005",
        "imdbID": "tt0399295",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTYzZWE3MDAtZjZkMi00MzhlLTlhZDUtNmI2Zjg3OWVlZWI0XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
    },
    {
        "Title": "Lords of Dogtown",
        "Year": "2005",
        "imdbID": "tt0355702",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDBhNGJlOTAtM2ExNi00NmEzLWFmZTQtYTZhYTRlNjJjODhmXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
    },
    {
        "Title": "The Lord of the Rings",
        "Year": "1978",
        "imdbID": "tt0077869",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BOGMyNWJhZmYtNGQxYi00Y2ZjLWJmNjktNTgzZWJjOTg4YjM3L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg"
    },
    {
        "Title": "Lord of the Flies",
        "Year": "1990",
        "imdbID": "tt0100054",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BOTI2NTQyODk0M15BMl5BanBnXkFtZTcwNTQ3NDk0NA@@._V1_SX300.jpg"
    },
    {
        "Title": "The Lords of Salem",
        "Year": "2012",
        "imdbID": "tt1731697",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMjA2NTc5Njc4MV5BMl5BanBnXkFtZTcwNTYzMTcwOQ@@._V1_SX300.jpg"
    },
    {
        "Title": "Greystoke: The Legend of Tarzan, Lord of the Apes",
        "Year": "1984",
        "imdbID": "tt0087365",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
    },
    {
        "Title": "Lord of the Flies",
        "Year": "1963",
        "imdbID": "tt0057261",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BOGEwYTlhMTgtODBlNC00ZjgzLTk1ZmEtNmNkMTEwYTZiM2Y0XkEyXkFqcGdeQXVyMzU4Nzk4MDI@._V1_SX300.jpg"
    },
    {
        "Title": "The Avengers",
        "Year": "2012",
        "imdbID": "tt0848228",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"
    },
    {
        "Title": "Avengers: Infinity War",
        "Year": "2018",
        "imdbID": "tt4154756",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg"
    },
    {
        "Title": "Avengers: Age of Ultron",
        "Year": "2015",
        "imdbID": "tt2395427",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg"
    },
    {
        "Title": "Avengers: Endgame",
        "Year": "2019",
        "imdbID": "tt4154796",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg"
    }
]


*/