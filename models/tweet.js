var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = require('./comment');

var TweetSchema = new Schema({
  body: {
    type: String,
    default: ""
  },
  // EMBEDDING
  // comments: [Comment.schema]

  // REFERENCING
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

var Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;