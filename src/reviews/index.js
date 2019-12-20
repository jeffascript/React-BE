const express = require ("express");
const fs = require ("fs-extra");
const path = require ("path");
const { check, validationResult, sanitizeBody } = require("express-validator");
const uuid = require("uuid/v4");

const commentPath = path.join(__dirname, "reviews.json");
const moviePathComment = path.join(__dirname, "../movies/movies.json");


 

const getAllReviews = async ()=>{
    const buffer = await fs.readFile(commentPath);
    return JSON.parse(buffer.toString())
};



const getMovieReviews = async ()=>{
    const buffer = await fs.readFile(moviePathComment);
    return JSON.parse(buffer.toString())
};



const router = express.Router();



router.get("/", async (req, res)=>{
    //get all comments
    res.send(await getAllReviews())
 });


 router.get("/:id", async (req, res)=>{
    //get single review
    const comments = await getAllReviews();
    const aComment = comments.filter(x => x.elementId === req.params.id)
    if (aComment)
        res.send(aComment)
    else
        res.status(404).send("Not found")
});



 
//  "_id": "123455",
//  "comment": "A good book but definitely I don't like many parts of the plot",
//  "rate": 3,
//  "elementId": "tt1seeYou",
//  "createdAt": "2019-08-01T12:46:45.895Z" 



 router.post("/",
    [check("comment").isLength({ min: 2, max: 10000}).withMessage("text must be between 5 and 1000 chars"),
    check("rate").isNumeric().withMessage("rating number--> 5"),
    check("elementId").exists().withMessage("The imdbID of the Movie"),
    sanitizeBody("rate").toInt()],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).send(errors)
        }
       
        
            const movies = await getMovieReviews()
            if (!movies.find(x => x.imdbID === req.body.elementId))
                return res.status(404).send("No movie for this comment")
        
            const toAdd = {
                ...req.body,
                createdAt: new Date(),
                
                _id: uuid()
            }
        
            const newComment = await getAllReviews()
            newComment.push(toAdd)
            await fs.writeFile(commentPath, JSON.stringify(newComment))
            res.send(toAdd)
        

           

    });


    router.put("/:id", async (req, res)=>{
        //Is there any book with the given bookId? 
        const movies = await getMovieReviews()
    
        if (req.body.elementId && !movies.find(x => x.imdbID === req.body.elementId))
            return res.status(404).send("Book not found")
    
        const comments = await getAllReviews();
        console.log(comments)
        const theComment = comments.find(c => c.elementId === req.params.id)
        if (theComment){
            delete req.body.elementId
            delete req.body.createdAt
            req.body.updatedAt = new Date()
            const updatedVersion = Object.assign(theComment, req.body) //<= COPY ALL THE PROPS FROM req.body ON THE ACTUAL review!!
            const index = comments.indexOf(theComment)
            comments[index] = updatedVersion;
            await fs.writeFile(commentPath, JSON.stringify(comments))
            res.send(updatedVersion)
        }
        else
            res.status(404).send("Not found")
    });



    router.delete("/:id", async (req, res) => {
    const comments = await getAllReviews(); 
      const afterDelete = comments.filter(x => x.elementId !== req.params.id);
      if (comments.length === afterDelete.length)
        return res.status(404).send("NOT FOUND");
      else {
        await fs.writeFile(commentPath, JSON.stringify(afterDelete));
        res.send("Comment Deleted successfully!");
      }
    });








 module.exports = router;