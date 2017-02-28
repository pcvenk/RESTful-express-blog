var express    = require('express'),
           app = express(),
          path = require('path'),
    bodyParser = require('body-parser'),
      mongoose = require('mongoose');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
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
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.send(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

app.listen(3000, function(){
   console.log('Server is running');
});