var express    = require('express'),
           app = express(),
          path = require('path'),
    bodyParser = require('body-parser'),
      mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//MONGOOOSE
mongoose.connect('mongodb://localhost/restfull-express-blog');

var blogSchema = new mongoose.Schema({
    title: 'String',
    image: 'String',
    body: 'String',
    created: {type: 'Date', default: Date.now()}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create(
//     {
//     title: 'My first Blog',
//     image: 'http://www.photosforclass.com/download/32278201023',
//     body: "This is the very first blog being served by the express app!!!"
//     }, function(err, blogs){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(blogs);
//         }
//     }
// );

app.get('/', function(req, res){
    res.redirect('/blogs');
});

//RESTful Routing

//INDEX
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.send(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

//NEW
app.get('/blogs/new', function(req, res){
   res.render('new');
});

//CREATE
app.post('/blogs', function(req, res){

    var blog = {
        title: req.body.title,
        image: req.body.image,
        body: req.body.body
    };

    Blog.create(blog, function(err, newBlog){
       if(err){
           console.log(err);
           res.render('new');
       } else {
          res.redirect('/blogs');
       }
    });
});

//SHOW
app.get('/blogs/:id', function(req, res){
   Blog.findById(req.params.id, function(err, clickedBlog){
       if(err){
           res.send(err);
       } else {
           console.log(clickedBlog);
           res.render('show', {
               blog: clickedBlog
           });
       }
   })
});

//EDIT
app.get('/blogs/:id/edit', function(req, res){
   Blog.findById(req.params.id, function(err, updateBlog){
       if(err){
           res.send(err);
       } else{
           res.render('edit', {
               blog: updateBlog
           });
       }
   })
});

app.listen(3000, function(){
   console.log('Server is running');
});