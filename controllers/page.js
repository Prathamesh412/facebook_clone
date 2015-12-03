var Page = require('../models/Page');
var User = require('../models/User');

  exports.getPage = function(req, res, next) {
      res.render('newpage');
  };

  exports.postPage = function(req, res) {
      var page = new Page({
          pageName: req.body.pageName,
          description: req.body.description,
          pageAdmin: [req.user._id]
      });
      page.save(function(err, data) {

          if (err)
              return next(err);
          else
              res.redirect('/page/' + page.pageName);

      });
  };

  exports.getSinglePage = function(req, res) {

      Page.findOne({
              pageName: req.params.pageName
          })
          .exec(function(err, page) {
              if (err)
                  return next(err);
                var isAdmin = false;
              if(req.user)
              {
                for(var i=0;i<page.pageAdmin.length;i++)
                  if(req.user._id.toString()==page.pageAdmin[i].toString())
                    isAdmin = true;
              }
             User.find({},function(err,users){
               res.render('page', {
                    page: page,
                    isAdmin:isAdmin,
                    users:users

                });
              }); 
      });
  };

exports.getEditPage = function(req, res){
  Page.findById(req.params.id,function(err, page){
    if(err)
      return err;
 
   if(users) 
    res.render('editpage',{
    page: page,
    users:users
     });
    
      
 
  });

};

exports.postEditPage = function(req, res){
  Page.findOne({
              pageName: req.params.pageName
          }).exec(function(err, page){
    if(err)
      return err;
   // page.pageName = req.body.pageName;
    page.description = req.body.description;
    page.save();
    res.redirect('/page/'+page.pageName);
    
  });

};
exports.removePage = function(req, res){
  Page.findById(req.params.id).remove(function(){
    res.redirect('/');
  });
};

exports.getModerator = function(req,res){   //This is to check for the moderator and push into the database
  
  User.findById(req.body.mod).exec(function(err,user){
    
    Page.findOne({pageName:req.params.pageName}).exec(function(err,page){
      
      page.pageMod.push(user._id);
      
      page.save();
      
      res.redirect('/');
      
    });
    
  });
  
}
  
exports.getEditor = function(req,res){   //This is to check for the editor and push into the database
  
  User.findById(req.body.editor).exec(function(err,user){
    console.log(req.body.editor);
    Page.findOne({pageName:req.params.pageName}).exec(function(err,page){
      console.log(req.params.pageName);
      page.pageEditor.push(user._id);
      
      page.save();
      
      res.redirect('/');
    
    });
    
  });
  
}
  
