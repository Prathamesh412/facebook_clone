var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var passportConf = require('./config/passport');
var MongoStore = require('connect-mongo')(session);

var app = express();

var userController = require('./controllers/user');
var homeController = require('./controllers/home');
var pageController = require('./controllers/page');

mongoose.connect("mongodb://localhost:27017/socialfly");
mongoose.connection.on('error',function(){
  console.log("Mongo Error in connection");
});
app.set('views',__dirname+"/views");
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "2hjkeydwjfhusdifsb",
  store: new MongoStore({
    url:"mongodb://localhost:27017/socialfly",
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser= req.user;
  next();
});


//Routes
/*

/search                 = userController.getProfiles
    username= Similar to the username
/friends                = userController.isLogin, userController.getFriends
/messages               = userController.isLogin, userController.getMessages
/requests/:userId       = userController.isLogin, userController.getSendFriendsRequest
/requests               = userController.isLogin, userControllers.getAllFriendsRequest
/requests/:userId/accept = userController.isLogin, userControllers.getAcceptFriendsRequest
/requests/:userId/reject  = userController.isLogin, userControllers.getRejectFriendsRequest

*/
app.get('/',homeController.getHome);

app.post('/login', userController.postLogin);
app.get('/login',userController.getLogin);
app.get('/auth/facebook',userController.getFacebookLogin);
app.get('/auth/facebook/callback',userController.getFacebookLoginCallback, function(req, res){
  res.redirect('/');
});
app.get('/signup', userController.getSignUp);
app.post('/signup',userController.postSignUp);
app.get('/logout', userController.getLogout);
app.get('/profile/:username',userController.getProfile)
app.get('/requests/:username',userController.isLogin, userController.getSendFriendsRequest);
app.get('/requests/:username/accept',userController.isLogin, userController.getAcceptFriendsRequest);
app.get('/requests/:username/reject',userController.isLogin, userController.getRejectFriendsRequest);

app.get('/page/new', pageController.getPage);
app.post('/page/new',pageController.postPage);
app.get('/page/:pageName',pageController.getSinglePage);
app.get('/page/:pageName/edit', pageController.getEditPage);
app.post('/page/:pageName/edit',pageController.postEditPage);
app.get('/page/:pageName/remove', pageController.removePage);
app.post('/page/:pageName/adduser',pageController.getModerator);
app.post('/page/:pageName/addeditor',pageController.getEditor);

app.listen('5000', function(){
  console.log("Server at port 5000");
});




