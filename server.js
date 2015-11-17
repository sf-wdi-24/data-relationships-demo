// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mongodb
mongoose.connect('mongodb://localhost/test');

// require Tweet and Comment models
var Tweet = require('./models/tweet');
var Comment = require('./models/comment');

// route to get all tweets
app.get('/api/tweets', function (req, res) {
  // EMBEDDING: don't need to call `.populate()` 
  // Tweet.find(function (err, allTweets) {
  //   res.json(allTweets);
  // });

  // REFERENCING: call `.populate()` to bring in
  // referenced comments
  Tweet.find()
    .populate('comments')
      .exec(function (err, allTweets) {
        if (err) {
          res.json(err);
        } else {
          res.json(allTweets);
        }
      });
});

// route to get one tweet
app.get('/api/tweets/:tweetId', function (req, res) {
  // find tweet id from url params
  var tweetId = req.params.tweetId;

  // find tweet in db using tweet id
  // REFERENCING: call `.populate()` to bring in
  // referenced comments
  Tweet.findOne({ _id: tweetId })
    .populate('comments')
      .exec(function (err, foundTweet) {
        res.json(foundTweet);
      });
});

// route to create new comment associated to tweet
app.post('/api/tweets/:tweetId/comments', function (req, res) {
  // find tweet id from url params
  var tweetId = req.params.tweetId;

  // find tweet in db using tweet id
  Tweet.findOne({ _id: tweetId }, function (err, foundTweet) {
    // create new comment
    var newComment = new Comment(req.body);
    
    // SAVE new comment
    // NOTE this is not required for embedding,
    // but it is for referencing!
    // saving the comment adds it to the comments collection
    newComment.save();

    // give it to foundTweet.comments (`.push()`)
    foundTweet.comments.push(newComment);

    // save foundTweet with new comment added
    foundTweet.save();

    // respond with new comment
    res.json(newComment);
  });
});

app.listen(3000, function() {
  console.log('server started');
});