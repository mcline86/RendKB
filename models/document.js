var mongoose = require("mongoose");

var docSchema = new mongoose.Schema({
    title   : String,
    db_ID: String,
    meta    : String,
    category: String,
    created : { type: Date, default: Date.now },
    updated : Date,
    views   : { type: Number, default: 0 },
    helpful : { type: Number, default: 0 },
    body    : String
});

module.exports = mongoose.model("Document", docSchema);
