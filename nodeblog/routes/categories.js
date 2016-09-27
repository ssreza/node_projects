var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')(process.env.DB_URL);
/* GET users listing. */
router.get('/show/:category', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({category: req.params.category}, {}, (err, posts)=>{ 	
	res.render('index', {
		'title':req.params.category,
		'posts': posts
	}); 

  });
});
router.get('/add', function(req, res, next) {
  
  		res.render('addCategory');
  	
});

router.post('/add', function(req, res, next) {
  
  	var name = req.body.name;
	// Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  // Check Errors
  var errors = req.validationErrors();
  if (errors) {
  	res.render('addPost', {
  		"errors":errors
  	});
  }else {
  	var categories =db.get('categories');

  	categories.insert({
  		'name': name
  	}, function(err, post){
  		if (err) {
  			console.log(err);
  			res.send(err);
  		} else {
  			req.flash('success', 'Category added');
  			res.location('/');
  			res.redirect('/');
  		}
  	});
  }
  	
});


module.exports = router;
