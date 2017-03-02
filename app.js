var express      = require('express'),
           app   = express(),
          path   = require('path'),
    bodyParser   = require('body-parser'),
methodOverride   = require('method-override'),
expressSanitizer = require('express-sanitizer'),
      mongoose   = require('mongoose');

// parse application/x-www-form-urlencoded && json file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(methodOverride('_method'));

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

    blog.body = req.sanitize(blog.body);

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

//UPDATE
app.put('/blogs/:id', function(req, res){

    var updatedBlog = {
        title: req.body.title,
        image: req.body.image,
        body: req.body.body
    };

    Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, updBlog){
       if(err){
           res.render(err);
       } else{
           res.redirect('/blogs/'+req.params.id);
       }
    });
});

//DESTROY
app.delete('/blogs/:id', function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.send(err);
       } else{
           res.redirect('/blogs');
       }
   })
});

app.listen(3000, function(){
   console.log('Server is running');
});