var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest:'./public/images'});
var mongodb = require('mongodb');
var db = require('monk')(process.env.DB_URL);
/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  posts.findById(req.params.id, (err, post)=>{
    res.render('show', {
        'post':post
    });
  });
});
router.get('/add', function(req, res, next) {
  categories = db.get('categories');
  categories.find({},{}, (error,categories)=>{
  	if(error){
  		res.render('addPost', {categories:[{name:'science'}]});
  	}else {
  		res.render('addPost', {categories:categories});
  	}
  });
});


router.post('/add', upload.single('mainimage') , function(req, res, next) {
	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;
	var date = new Date();
	var posts = db.get('posts');
	if (req.file) {
		var mainimage = req.file.filename;
		console.log('loaded');
	}else{
		console.log('not loaded');
		var mainimage='no-image';
	}

	// Form Validator
  req.checkBody('title','Title field is required').notEmpty();
  req.checkBody('body','Body field is required').notEmpty();
  
  // Check Errors
  var errors = req.validationErrors();
  if (errors) {
  	res.render('addPost', {
  		"errors":errors
  	});
  }else {
  	posts.insert({
  		'title': title,
  		'body':body,
  		'category':category,
  		'date':date,
  		'author':'shifat',
  		'mainimage':mainimage
  	}, function(err, post){
  		if (err) {
  			console.log(err);
  			res.send(err);
  		} else {
  			req.flash('success', 'Post added');
  			res.location('/');
  			res.redirect('/');
  		}
  	})
  }

});


router.post('/addcomment/:id',  function(req, res, next) {
  var name = req.body.name;
  var body = req.body.body;
  var email = req.body.email;
  var commentdate = new Date();


  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('body','Body field is required').notEmpty();
  req.checkBody('email','Email field is required but not displayed').notEmpty();
  req.checkBody('email','Email field needs to be valid').isEmail();

  // Check Errors
  var errors = req.validationErrors();
  if (errors) {
    var posts = db.get('posts');
    posts.findById(req.params.id, (err, post)=>{
      res.render('show', {
          "errors":errors,
          post :post
        });
    });
    
  }else {
    var comment ={
      "name": name,
      "email":email,
      "body":body,
      "commentdate":commentdate
    };
    var posts = db.get('posts');
    posts.update({
        "_id":req.params.id
        },{
          $push:{
            "comments":comment
          }
        }, (err, doc)=>{
          if (err) 
            throw err;
          else {
            req.flash('success', 'Comment Added');
            res.location('/posts/show/'+req.params.id);
            res.redirect('/posts/show/'+req.params.id)
          }
        })
  }

});
module.exports = router;
