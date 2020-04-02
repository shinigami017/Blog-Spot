var bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    port = 3000;

// Application Configuration

mongoose.connect("mongodb://localhost/blog_application");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose Model Configuration

var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: { type: Date, default: Date.now }
    }),
    Blog = mongoose.model("Blog", blogSchema);

// Restful Routes

// ROOT ROUTE
app.get("/", function(request, response) {
    response.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(request, response) {
    Blog.find({}, function(error, blogs) {
        if (error) {
            console.log(error);
        } else {
            response.render("index", { blogs: blogs });
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(request, response) {
    response.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(request, response) {
    request.body.blog.body = request.sanitize(request.body.blog.body);
    Blog.create(request.body.blog, function(error, newBlog) {
        if (error) {
            console.log(error);
            alert("Something went wrong! Please try again.");
        } else {
            response.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(request, response) {
    Blog.findById(request.params.id, function(error, foundBlog) {
        if (error) {
            console.log(error);
            alert("Something went wrong! Please try again.");
            response.redirect("/blogs");
        } else {
            response.render("show", { blog: foundBlog });
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(request, response) {
    Blog.findById(request.params.id, function(error, foundBlog) {
        if (error) {
            console.log(error);
            alert("Something went wrong! Please try again.");
            response.redirect("/blogs");
        } else {
            response.render("edit", { blog: foundBlog });
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(request, response) {
    request.body.blog.body = request.sanitize(request.body.blog.body);
    Blog.findByIdAndUpdate(request.params.id, request.body.blog, function(error, updatedBlog) {
        if (error) {
            console.log(error);
            alert("Something went wrong! Please try again.");
            response.redirect("/blogs");
        } else {
            response.redirect("/blogs/" + request.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(request, response) {
    Blog.findByIdAndRemove(request.params.id, function(error) {
        if (error) {
            console.log(error);
            alert("Something went wrong! Please try again.");
            response.redirect("/blogs");
        } else {
            response.redirect("/blogs");
        }
    });
});



app.listen(port, function() {
    console.log("Server is running on port " + port);
    console.log("Press CTRL + C to stop the server.");
});