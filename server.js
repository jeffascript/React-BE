const express = require("express");
const movieRouter = require("./src/movies");
const reviewRouter = require("./src/reviews")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints");

const server = express();
server.use(express.json());


server.use(cors(corsOptions));
//  server.use(cors());


const port = process.env.PORT || 6000


server.use("/media", movieRouter);

server.use("/reviews", reviewRouter);


console.log(listEndpoints(server));



var whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://jefflix.herokuapp.com/']
 var corsOptions = {
  origin: function (origin, callback) {
     if (whitelist.indexOf(origin) !== -1) {
       callback(null, true)
     } else {
       callback(new Error('Not allowed by CORS'))
     }
   }
 }


server.get("/test", (req,res)=>{
    res.send("we are live bro")
})



server.listen(port, ()=>{
    console.log(`Currently listening to port ${port}`)
})