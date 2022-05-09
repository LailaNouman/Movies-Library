'use strict';

const express = require("express");
const cors = require("cors");
const axios = require('axios').default;
const bodyParser = require('body-parser');
require("dotenv").config();
const port = 3000;
const app = express();
app.use(cors());
let apiKey = process.env.API_KEY ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let urll = "postgres://laila:0000@localhost:5432/movie";
const { Client } = require('pg')
const client = new Client(urll);

app.get("/trending", trendingHandler);
app.get("/search", searchHandler);
app.get('/latest', latestHandler);
app.get('/top', topHandler);
app.post('/addMovie', addHandler);
app.get('/getMovies', getHandler);
app.put('/update/:id', updateHandler);
app.delete('/delete/:id', deleteHandler);
app.get('/getMovie/:id', getmovieHandler);

function updateHandler(req, res){
    let id = req.params.id;
    //let specificmovie = req.body.specificmovie;
    let comment = req.body.comment;
    let values = [comment];
    let sql = `UPDATE addMovie SET comment = $1 WHERE id=${id} RETURNING *;`;
    client.query(sql,values).then(result =>{
          console.log(result.rows[0]);
          res.json(result.rows);
    }).catch()
}

function deleteHandler(req, res){
   let id = req.params.id;
   let sql = `DELETE FROM addMovie WHERE id=${id} RETURNING *;`;
   client.query(sql).then(result =>{
        console.log(result.rows[0]);
        res.json(result.rows);
   }).catch(err =>{
     console.log(err);
   })
}

function getmovieHandler(req, res){
  let id = req.params.id;
  let sql = `SELECT * FROM addMovie WHERE id=${id};`;
  client.query(sql).then(result=>{
    console.log(result);
    res.json(result.rows);
  }).catch()
}

function addHandler(req, res){
   console.log(req.body);
   //res.send('ok');
   let {specificmovie,comment} = req.body;
   let sql = `INSERT INTO addMovie(specificmovie,comment)VALUES ($1,$2) RETURNING *;`; 
   let values = [specificmovie,comment];
   client.query(sql,values).then(result=>{
     console.log(result);
     return res.status(201).json(result.rows);
   })
}

function getHandler(req, res){
  let sql = `SELECT * FROM addMovie;`;
  client.query(sql).then(result=>{
    console.log(result);
    res.json(result.rows);
  }).catch()
}


function trendingHandler(req, res) {  
  let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`; 
    axios.get(url)
    .then(result => {
      //  console.log(result.data.results);
      //  res.send("API gave me the data")
        let newMovie;
        let newArr = [];
        for(let i = 0; i < result.data.results.length; i++){
          newMovie =  new Movie(
          result.data.results[i].id,
          result.data.results[i].title,
          result.data.results[i].release_date,
          result.data.results[i].poster_path,
          result.data.results[i].overview)
          newArr.push(newMovie);
        }     
          res.json(newArr)
      
    })
    .catch(error => {
       console.log(error);
       res.send("error in getting data from API")
    })
};

function searchHandler(req, res) {
    // console.log(req.query);
    // res.send("search is done")
    let movieName = req.query.name;
    console.log(movieName);
    let url =
     `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`;
    axios.get(url)
    .then(result =>{
      console.log(result.data.results);
      res.json(result.data.results)
    })
    .catch(error =>{
       res.send("error cant search about this")
    })
};

function latestHandler(req, res) {  
  let url = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}`; 
    axios.get(url)
    .then(result => {
      // console.log(result.data);
      // res.send(result.data)
          // let newMovie =  new Movie(
          let a = [{overview : result.data.overview}, {status : result.data.status}]
          res.json(a)
      
    })
    .catch(error => {
       console.log(error);
       res.send("error in getting data from API")
    })
};

function topHandler(req, res) {  
  let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`; 
    axios.get(url)
    .then(result => {
      // console.log(result.data.results);
      // res.send(result.data)
       let topMovie;
       let newArr = [];
       for(let i = 0; i < result.data.results.length; i++){
         topMovie =  new Movie(
         result.data.results[i].id,
         result.data.results[i].title,
         result.data.results[i].release_date,)
         newArr.push(topMovie);
       }     
         res.json(newArr)
      
    })
    .catch(error => {
       console.log(error);
       res.send("error in getting data from API")
    })
};

function Movie(id,title,releasedate,path,overview){
    this.id = id;  
    this.title = title
    this.releasedate = releasedate;
    this.path = path;
    this.overview = overview
};

// const movieData = require("./MovieData/data.json")

// app.get("/", homeHandler); 
// app.get("/favorite", favHandler);
// app.get("*", errorHandler);

// function homeHandler(req,res){
    
//     let result = new Movie(movieData.title,movieData.poster_path,movieData.overview);
//     res.json(result);
// };

// function favHandler(req, res) {
//     res.send("Welcome to thefavorite page");
// };

// app.use(function(err,req,res,next){
// console.error(err.stack)
// res.status(500).send('Sorry, something went wrong')
// })

// function errorHandler(req, res, next) {
//      res.status(404).send("Page not found error")
//    }

client.connect().then(()=>{

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

})

