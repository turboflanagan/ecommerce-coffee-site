var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user);
	res.render('index', { user : req.user });  // req.user gets created by passport
});

////////////////  REGISTER GET ROUTE  //////////////////////
router.get('/register', function(req, res, next){
	res.render('register', {});
});

////////////////  REGISTER POST ROUTE  //////////////////////
router.post('/register', function(req, res, next){
	Account.register(new Account(
		{username: req.body.username}),
	req.body.password,
	function(error, account){
		if(error){
			console.log(error);
			return res.render('index');
		}else{
			passport.authenticate('local')(req, res, function(){
				req.session.username = req.body.username;
				res.redirect('/');
			});
		};
	});
});

////////////////  LOGIN GET ROUTE  //////////////////////
router.get('/login', function(req, res, next){
	res.render('login');
});

router.post('/login', function(req, res, next){
	req.session.username = req.body.username;
	res.redirect('/');
});



module.exports = router;
















