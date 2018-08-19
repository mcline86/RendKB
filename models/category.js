var mongoose = require("mongoose");

var catSchema = new mongoose.Schema({
        db_ID: String,
        name: String,
        parent: String
});

module.exports = mongoose.model("Category", catSchema);
