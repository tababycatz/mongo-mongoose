var mongoose = require("mongoose");

// ref to a Schema constructor //
var Schema = mongoose.Schema;
// via Schema constructor, create new UserSchema object //
var ArticleSchema = new Schema({
    // 'title' is required and type String and must be unique //
    title: {
        type: String,
        required: true,
        unique: true
    },
    // 'link' is required and type String //
    link: {
        type: String,
        required: true
    },
    // 'note' ref property links to ObjectID of Note model, its an object that stores a Note id //
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// created model from above schema, using mongoose's model method //
var Article = mongoose.model("Article", ArticleSchema);

// Export the article model //
module.exports = Article;