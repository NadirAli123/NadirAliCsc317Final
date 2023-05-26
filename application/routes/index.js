var express = require('express');
const { isMyProfile } = require('../middleware/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"[Nadir Ali~]"});
});

router.get("/login", function(req, res){
  res.render('login', { title: 'Log In'});
})

router.get("/about", function(req, res){
  res.render('about', { title: 'About'});
})

router.get("/index", function(req, res){
  res.render('index', { title: 'Index'});
})

router.get("/viewpost", function(req,res){
  res.render('viewpost', {title: `View Post `});
});

router.get("/register", function(req, res){
  res.render('register', { title: 'Register'});
})

router.get("/profile/:id(\\d+)", isMyProfile, function(req, res){
  res.render('profile', { title: 'Profile'});
})

router.get("/postvideo", function(req, res){
  res.render('postvideo', { title: 'Post Video'});

  
})



module.exports = router;

