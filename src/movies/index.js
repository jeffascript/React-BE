const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const uuid = require("uuid/v4");
const multer = require("multer")
const { Transform } = require("json2csv");
const { check, validationResult, sanitizeBody } = require("express-validator")
const generatePDF = require("../lib/generate-pdf")

// const emailHelper = require("../mail/mail-poster")

const moviesJsonPath = path.join(__dirname, "movies.json");
const reviewsJsonPath = path.join(__dirname, "../reviews/reviews.json");

const getMovies = async()=>{ 
    const buffer = await fs.readFile(moviesJsonPath);
    return JSON.parse(buffer.toString())
};

const getReviewsForMovies = async()=>{
    const buffer = await fs.readFile(reviewsJsonPath);
    return JSON.parse(buffer.toString())
};



const router = express.Router();

/**
 * Get Movies
 */
router.get("/", async (req, res)=>{
    res.send(await getMovies())
});



/**
 * Export CSV
 */
router.get("/exportToCSV",  (req, res)=>{

    // "asin": "1487403127",
    //   "title": "Sector Guard Collection 3",
    //   "img": "https://images-na.ssl-images-amazon.com/images/I/51-Q9IBcexL.jpg",
    //   "price": 6.61,
    //   "category": "scifi"

 const filePath = path.join(__dirname, "./movies.json");
  const fields = ["asin", "title", "img", "price","category"];
  const opts = { fields };

  const json2csv = new Transform(opts);

console.log("hey", json2csv)

res.setHeader("Content-Disposition", `attachment; filename=file.csv`);

  fs.createReadStream(filePath)
    .pipe(json2csv)
    
     .pipe(res)

});


/**
 * Save CSV
 */
router.get("/saveCSV",  (req, res)=>{
 const filePath = path.join(__dirname, "./movies.json");
  const fields = ["asin", "title", "img", "price","category"];
  const opts = { fields };

  const json2csv = new Transform(opts);

console.log("hey", json2csv)

  fs.createReadStream(filePath)
    .pipe(json2csv)
    .pipe(fs.createWriteStream(path.join(__dirname, `../../images/file.csv`)));
  
});


/**
 * Email CSV
 */
router.get("/csv/emailCSV", async (req, res)=>{
    
    const filePath = path.join(__dirname, "./movies.json");
     const fields = ["asin", "title", "img", "price","category"];
     const opts = { fields };
     const json2csv = new Transform(opts);

     const csvName = 'users'
//    const csvPath = path.join(__dirname, `../../images/${csvName}.csv`)
const csvPath = path.join(__dirname, `../../images/${csvName}.csv`)

   console.log("hey", json2csv)
   
     fs.createReadStream(filePath)
       .pipe(json2csv)
       .pipe(fs.createWriteStream(csvPath));

       await emailHelper(csvPath, csvName)
     
   });


/**
 * Get Movies by imdbID
 */
router.get("/:imdbID", async (req, res)=>{
    const movies = await getMovies()
    const movie = movies.find(b => b.imdbID === req.params.imdbID);
    if (movie)
        res.send(movie)
    else
        res.status(404).send("Movie Not found")
});



/**
 * Export the content of the movie to PDF for user
 */
router.get("/:id/exportToPDF", async (req, res) => {
  const books = await getMovies();
  const book = books.find(b => b.asin === req.params.id);
  if (book) 
  await generatePDF(book);

  const file = path.join(__dirname, `../lib/${book.asin}.pdf`);
  // res.download(file)
  //     res.send(book)
  // else
  //     res.status(404).send("Not found")

  const { id } = req.params;
  console.log({ id });

  res.setHeader("Content-Disposition", `attachment; filename=${id}.pdf`);

  fs.createReadStream(file).pipe(res);
});






/**
 * Post a new Movie
 * 
 *   "Title": "The Lord of the Rings: The Fellowship of the Ring",
    "Year": "2001",
    "imdbID": "tt0120737",
    "Type": "movie",
    "Poster": "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg"
 */
 
router.post("/",
    [check("Title").exists().withMessage("Title is required"),
    check("Year").isNumeric().withMessage("year should be exactly -> YYYY"),
    check("imdbID").exists().withMessage("You should specify the imdbID"),
    check("Type").exists().withMessage("Category is required"),
    check("Poster").exists().withMessage("Img url is required"),
    sanitizeBody("Year").toFloat()]
    ,async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).send(errors)
        }

    else {
        const movies = await getMovies()
        const imdbCheck = movies.find(x => x.imdbID === req.body.imdbID) //get a previous element with the same asin
        if (imdbCheck) //if there is one, just abort the operation
            res.status(500).send("imdbID should be unique")

            const toAdd = {
                ...req.body,
                createdAt: new Date(),
                _id: uuid()
            }        
        movies.push(toAdd)
        await fs.writeFile(moviesJsonPath, JSON.stringify(movies))
        res.status(201).send(toAdd)
    }

    });




    // CommentsJsonPath

/**     
 * Post reviews to the Movie by "imdbID"
 */
    router.post("/:id/reviews",
    [check("comment").isLength({ min: 2, max: 10000}).withMessage("text must be between 5 and 1000 chars"),
    check("rate").isNumeric().withMessage("rating number--> 5"),
    check("elementId").exists().withMessage("The imdbID of the Movie"),
    sanitizeBody("rate").toInt()],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){

            res.status(400).send(errors)
        }
            

       const movies = await getMovies()
        const comments = await getReviewsForMovies()
       if  
        //    (!comments.find(x => x.bookId === req.params.id))
        //     && 
            (!movies.find(x => x.imdbID === req.body.elementId)) 
            {
            return res.status(404).send("Comment not found")
        }
       
        
        //const asinCheck = books.find(x => x.asin === req.body.bookId) 
        //if (asinCheck) //if there is one, just abort the operation
            //res.status(500).send("ASIN should be unique")
      
        const toAdd = {
            ...req.body,
            createdAt: new Date(),
            _Id: uuid()
        }
    
        
        comments.push(toAdd)
        await fs.writeFile(reviewsJsonPath, JSON.stringify(comments))
        res.send(toAdd)

    });


/**     
 * Post ImageUrls to the Movie by "imdbID"
 */
    const multerConfig = multer({});
    router.post("/:imdbID/upload",
    [check("Poster").exists().withMessage("Img is required")],
    multerConfig.single("image"), async (req, res) => {
        //we need to check if we have an existing product with the given movie imdbID
        const movies = await getMovies();
        const movie = movies.find(mov => mov.imdbID === req.params.imdbID);
        if (movie) {
const fileDest = path.join(__dirname,"../../images/",req.params.imdbID + path.extname(req.file.originalname));
          await fs.writeFile(fileDest, req.file.buffer);
          movie.updatedAt = new Date();
          movie.Poster =
            "/images/" + req.params.imdbID + path.extname(req.file.originalname);
          await fs.writeFile(moviesJsonPath, JSON.stringify(movies));
          res.send(movie);
        } 
        
        else res.status(404).send("Not found")

      });



/**     
 * Post movie with imgURL together
 */
//  var upload = multer({});
//  router.post("/file", 
//  [check("asin").exists().withMessage("You should specify the asin"),
//     check("title").exists().withMessage("Title is required"),
//     check("category").exists().withMessage("Category is required"),
//     check("price").isNumeric().withMessage("Price should be a number"),
//     check("imageUrl").exists().withMessage("Img is required"),
    
//     sanitizeBody("price").toFloat()],
//     upload.single("image"), async (req, res) => {
//    const newID = uuid();
//    const { originalname, buffer } = req.file;
//    const ext = path.extname(originalname);
//    const ImgNameToBeSaved = newID.concat(ext);
//    let ImgFilePath = path.join(__dirname, "../../images/", ImgNameToBeSaved);
//    await writeFile(ImgFilePath, buffer);
//    const books = await getMovies();
//    let newBook = {
//      ...req.body,
//      imageUrl: ImgFilePath,
//      _id: newID,
//      createdAt: new Date()
//    };
//    books.push(newBook);
//    const newProductbuffer = JSON.stringify(books);
//    await writeFile(filePath, newProductbuffer);
//    res.send(newBook);
//  });










/**     
 * Get Movie Reviews by "imdbID"
 */

    router.get("/:imdbID/reviews", async (req, res)=>{
        const movies = await getMovies()
        const comments = await getReviewsForMovies();
        const movie = movies.find(b => b.imdbID === req.params.imdbID);
        const comment = comments.filter(x => x.elementId === req.params.imdbID)
        if (comment && movie){
        let combined = {...movie, comment}
            res.send(combined)}
        else
            res.status(404).send("No comment found")
    });
    

    
/**     
 * DELETE moviee reviews with Review ID
 */
    router.delete("/comments/:id2", async (req, res) => {
        const comments = await getReviewsForMovies(); 
          const afterDelete = comments.filter(x => x.comment_Id !== req.params.id2);
          if (comments.length === afterDelete.length)
            return res.status(404).send("NOT FOUND");
          else {
            await fs.writeFile(reviewsJsonPath, JSON.stringify(afterDelete));
            res.send("Comment Deleted successfully through books!");
          }
        });







/**     
 * PUT Movie  by "imdbID"
 */

router.put("/:imdbID", async(req, res)=>{
    const movies = await getMovies()
    const movie = movies.find(m => m.imdbID === req.params.imdbID);
    if (movie)
    {
        delete req.body._id
        delete req.body.createdAt
        req.body.updatedAt = new Date()
        const position = movies.indexOf(movie);
        const movieUpdated = Object.assign(movie, req.body)
        movies[position] = movieUpdated;
        await fs.writeFile(moviesJsonPath, JSON.stringify(movies))
        res.status(200).send(movieUpdated)
    }
    else
        res.status(404).send("Not found")
} );


/**     
 * DELETE Movie  by "imdbID"
 */


router.delete("/:imdbID", async(req, res) => {
    const movies = await getMovies()
    const moviesToBeSaved = movies.filter(m => m.imdbID !== req.params.imdbID)
    if (moviesToBeSaved.length === movies.length)
        res.status(404).send("cannot find book " + req.params.imdbID)
    else { 
        await fs.writeFile(moviesJsonPath, JSON.stringify(moviesToBeSaved))
        res.send("Deleted")
    }
});



module.exports = router;