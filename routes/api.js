var Category = require("../models/category"),
    Doc      = require("../models/document"),
    Comment  = require("../models/comment");


exports.getTag = function(req, res, next) {
  Category.findById(req.params.id, function(err, tag) {
    if(err) throw err;
    res.json(tag);
  });
};

exports.getAllTags = function(req, res, next) {
  Category.find({}, function(err, tags) {
    if(err) throw err;
    res.json(tags);
  });
};

exports.getTagsFromParent = function(req, res, next) {
  Category.find({parent: req.params.parent}, function(err, tags) {
    if(err) throw err;
    res.json(tags);
  });
};

//================================================
//              Doc API



exports.getDocsFromTag = function(req, res, next) {
  Doc.find({"category": "" + req.params.id}, function(err, docs) {
    if(err) throw err;
    res.json(docs);
  });
};
