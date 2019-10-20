var mongoose = require("mongoose");

//ref to schema constructor //
var Schema = mongoose.Schema;

// create new noteschema obj using schema constructor //
var NoteSchema = new Schema({
    
    // 'title' is string type //
    title: String,
    
    // 'body' is string type //
    body: String
});

// creates model from above schema using mongoose's model method //
var Note = mongoose.model("Note", NoteSchema);

// exports note model //
module.exports = Note;