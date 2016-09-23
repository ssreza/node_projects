var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')(process.env.DB_URL);
/* GET home page. */
router.get('/', function(req, res, next) {
 
  var posts = db.get('posts');
  posts.find({}, {}, (err, posts)=>{
  	  res.render('index', { posts: posts});

  });
});

module.exports = router;
