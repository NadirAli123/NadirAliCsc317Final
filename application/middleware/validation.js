module.exports = {
    usernameCheck: function(req,res,next) {
        var {username} = req.body;
        if(!validator.isLength(username, {min:3})){
            req.flash("error", )
        }
    },
    passwordCheck: function(req,res,next) {},
    emailCheck: function(req,res,next) {},
    tosCheck: function(req,res,next) {},
    ageCheck: function(req,res,next) {},
    isUsernameUnique: function(req,res,next) {},
    isEmailUnique: function(req,res,next) {},
   
};//not used, in my hbs