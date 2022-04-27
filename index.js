'use strict';

const express = require('express')

const app = express();

const port = 3000;
const movieData = require("./MovieData/data.json")

app.get("/", homeHandler); 
app.get("/favorite", favHandler);

function homeHandler(req,res){
    
    let result = new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(result);
};

function favHandler(req, res) {
    res.send("Welcome to thefavorite page");
}

app.use(function(err,req,res,next){
console.error(err.stack)
res.status(500).send('Sorry, something went wrong')
})

// app.use(function(req, res, next) {
//     res.status(404).send("Page not found error")
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function Movie(title,path,overview){
    this.title = title;
    this.path = path;
    this.overview = overview
};