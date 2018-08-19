var express        = require("express"),
    app            = express(),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    bodyParser     = require("body-parser"),
    Logon          = require("./models/logon"),
    Doc            = require("./models/document"),
    Comment        = require("./models/comment"),
    Category       = require("./models/category"),
    methodOverride = require("method-override");


mongoose.connect("mongodb://localhost:27017/wiki", {useNewUrlParser: true});

var basic = require("./routes/index");


app.use(express.static(__dirname + "/public")); // set default folder to /public

app.use(bodyParser.urlencoded({extended: true})); //body parser for form data
app.set("view engine", "ejs");                  //  Using EJS templates
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({           // Sessions needed for passport integration (later)
  secret: "If you can read this, you shouldn't be here and you know it. . .",// Not you Michael...your cool
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.info = req.flash("info");
   next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Logon.authenticate()));
passport.serializeUser(Logon.serializeUser());
passport.deserializeUser(Logon.deserializeUser());

//==================================================================
//=                                                              ===
//=                    Begin Basic Routes                        ===
//=                                                              ===
//==================================================================

app.get("/", function(req, res) {
  Doc.find({}, function(err, docs) {
    if(err) {

      req.flash("error", "No Documents were found");
      res.render("index");
    } else {

      res.render("index", {docs: docs});
    }
  });
});

//=======================================================
//
//                 Document routes
//
//=======================================================

app.get("/doc/new", function(req, res) {
  res.render("newDoc");
});

app.post("/doc/new", function(req, res, next) {
  Doc.create(req.body.docInfo, function(err, doc){
    if(err) {
        res.redirect("back");

    } else {
        res.redirect("/");
    }
  });
});

app.get("/doc/:id/edit", function(req, res) {
  Doc.findById(req.params.id, function(err, doc) {
    if(err) {
      req.flash("error", "The document you requested couldn't be found");
      res.render("index");
    } else {
      Category.find({}, function(err, tags) {
        if(err) {
          req.flash("error", "Unable to load tags, are you on the right website?");
          res.redirect("back")
        }else {
          req.flash("info", "We found the document you requested in the trash, should still be okay.");
          res.render("editor", {doc: doc, tags: tags});
        }
      });
    }
  });
});

app.get("/doc/:id/show", function(req, res, next) {
  Doc.findById(req.params.id, function(err, doc){
    if(err) {
      console.log(err);
      req.flash("error", "Document not found.");
      res.render("show", {doc: false});
    } else {

      res.render("show", {doc: doc});
    }
  });
});

app.post("/doc/:id/update", function(req, res, next) {
    Doc.findByIdAndUpdate(req.params.id, req.body.docInfo, function(err, doc) {
      if(err){

        res.render("index");
      }else {

        res.render("editor", {doc: doc});
      }
    });
});

app.post("/doc/:id/delete", function(req, res) {
  Doc.findByIdAndDelete(req.params.id, function(err, doc) {
    if(err){
      res.redirect("back");
    }else {
      res.render("index");
    }
  });
});

//=======================================
//           Tag Routes
//=======================================

var api = require("./routes/api");

app.get("/tags", function(req, res) {
    Category.find({}, function(err, tags) {
      if(err) {
        req.flash("error", "No tags could be found, is the database down again? Mother F****!")
        res.redirect("back");
      } else {
        res.render("tagTool", {tags: tags});
      }
    });
});

app.post("/tags/new", function(req, res) {
  Category.create(req.body.tag, function(err, tag) {
    if(err){
      req.flash("error", "We could not create the requested tag.");
      res.redirect("/tags");
    } else {
      req.flash("info", "New tag: " + tag.name + " was created successfully!");
      res.redirect("/tags");
    }
  });
});

app.get("/tags/:id/load", api.getTag);

app.post("/tags/:id/update", function(req, res) {
  //Update Tag
});

app.post("/tags/:id/delete", function(req, res) {
  Category.findByIdAndDelete(req.params.id, function(err, tag) {
    if(err) {

      req.flash("error", "There was a problem deleting the TAG, please try again.");
      res.redirect("back");
    } else {

      res.render("index");
    }
  });
});

app.get("/tags/:parent/parent", api.getTagsFromParent);

//==================================================================

app.listen("80",  function () {
   console.log(__dirname);
   Logon.findOne({username: "mike"}, function(err, usr) {
     if(err){
       console.log("err");
     }
     else {
       if(usr == null) {
         var mike = new Logon({username: "mike"});
         Logon.register(mike,"password", function(err, me) {
           if(err){
             console.log(err);
           }
           else {
             console.log(me);
           }
         })
       }
     }
   });
});
