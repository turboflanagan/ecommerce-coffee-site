var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(req.user);
	res.render('index', { user : req.user });  // req.user gets created by passport
});


///////////////////////////////////////////////////////
///////////////// REGISTER FUNCTIONS //////////////////
///////////////////////////////////////////////////////

////////////////  REGISTER GET ROUTE  //////////////////////
router.get('/register', function (req, res, next){
	res.render('register', {});
});

////////////////  REGISTER PAGE POST ROUTE  //////////////////////
router.post('/register', function (req, res, next){
	Account.register(new Account(
		{
		username: req.body.username  // username is pulled in from the .body of our registration page
		}), req.body.password,
		function(error, account){
			if(error){
				console.log(error);
				return res.render('/register', { err : err });
			}else{
				passport.authenticate('local')(req, res, function(){
					req.session.username = req.body.username;
					res.redirect('/');
				});
			};
		});
});

///////////////////////////////////////////////////////////
///////////////////// LOGIN FUNCTIONS /////////////////////
///////////////////////////////////////////////////////////

////////////////  LOGIN GET ROUTE  //////////////////////
router.get('/login', function (req, res, next){
	//the user is already logged in
    if(req.session.username){
    	console.log("************** ALREADY LOGGED-IN *************");
        res.redirect('/choices');
    }
    //req.query.login pulls the query parameters right out of the http headers!
    //They are here and failed a login
    if (req.query.failedlogin){
    	console.log("************** LOGIN FAILED *************");
        res.render('login', { failed : "Your username or password is incorrect." });    
    }
    //They are here and aren't logged in
	res.render('login');

});

////////////////  LOGIN POST ROUTE  /////////////////////
router.post('/login', function (req, res, next){
    if(req.body.getStarted){
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.render('register', { err : err });
            }
            if (!err)
            passport.authenticate('local')(req, res, function () {
                req.session.username = req.body.username;
                res.render('/', { username : req.session.username });
            });
        });        
    }

    if (!req.body.getStarted){
      passport.authenticate('local', function (err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.redirect('/login?failedlogin=1');
        }
        if (user){
            // Passport session setup.
            passport.serializeUser(function (user, done) {
              console.log("serializing " + user.username);
              done(null, user);
            });

            passport.deserializeUser(function (obj, done) {
              console.log("deserializing " + obj);
              done(null, obj);
            });        
            req.session.username = user.username;
        }

        return res.redirect('/');
      })(req, res, next);
    }
});



///////////////// PREFERENCES GET ROUTE  /////////////////////
router.get('/preferences', function (req, res, next){
	res.render('preferences');
});

/////////////////  LOGGED-IN LANDING PAGE GET ROUTE  ///////////////////



////////////////  LOGOUT GET ROUTE  ////////////////////////
router.get('/logout', function (req, res, next) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});


module.exports = router;
















