var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
const UserError = require('../helpers/error/UserError');
var {isLoggedIn, isMyProfile } = require("../middleware/auth");
var {getPostById } = require("../middleware/posts");
/* GET users listing. */

router.post('/register', async function(req, res, next){
  var {username, email, password} = req.body;
  try{
    var[rows, fields] = await db.execute(`select id from users where 
    username=?;`, [username]);
    if (rows && rows.length > 0){
      return res.redirect('/register');
    }
    var[rows, fields] = await db.execute(`select id from users where 
    email=?;`, [email]);
    if (rows && rows.length > 0){
      return res.redirect('/register');
    }

    var hasedPassword = await bcrypt.hash(password, 3);

    var [resultObject, fields] = await db.execute(`INSERT INTO users
      (username, email, password)
      value
      (?,?,?);`, [username, email, hasedPassword]);

    if (resultObject && resultObject.affectedRows == 1){
        return res.redirect('/login');
      }else{
        return res.redirect('/register');
      }

    console.log(resultObject);
    res.end();
  }catch(error){
      next(error);
  }
  
});


router.post("/login", function(req, res, next) {
  const{username, password} = req.body;

  let loggedUserId;
  let loggedUsername;


  db.query(`select id, username, password from users where username =?`,
   [username])
    .then(function([results,fields]){
      if(results && results.length==1){
        loggedUserId = results[0].id;
        loggedUsername = results[0].username;
       let dbPassword = results[0].password;
       return bcrypt.compare(password, dbPassword);
      }else{
        throw new UserError('Failed Login: incorrect user or pass', '/login', 200);
      }
    }).then(function(passwordsMatched){
      if(passwordsMatched){
        req.session.userId = loggedUserId;
        req.session.username = loggedUsername;
        req.flash("success", `${loggedUsername}, you are now logged in`);
        req.session.save(function(saveErr){
          res.redirect('/');
        })
      }else{
        throw new UserError('Failed Login: Invalid user credentials', '/login', 200);
      }
    })
    .catch(function(err){
      if(err instanceof UserError){
        req.flash("error", err.getMessage());
        req.session.save(function(saveErr){
          res.redirect(err.getRedirectURL());
        })
      }
      else{
        next(err);
      }
    })
});



router.get("/profile/:id(\\d+)",  function(req, res){
  res.render("profile");
});

router.get("/logout", function (req, res, next) {
  req.session.destroy(function(err){
    if(err){
      next(err);
    }
    return res.redirect('/');
  })
});



/*
router.post('/register', async function(req, res, next) {
  var {username, email, password} = req.body;
  
  try{
    var[rows, fields] = await db.execute(`select id from users where 
    username=?;`, [username]);
    if (rows && rows.length > 0){
      return res.redirect('/register');
    }
    var[rows, fields] = await db.execute(`select id from users where 
    email=?;`, [email]);
    if (rows && rows.length > 0){
      return res.redirect('/register');
    }

    var hasedPassword = await bcrypt.hash(password, 3);

    var [resultObject, fields] = await db.execute(`INSERT INTO users
  (username, email, password)
  value
  (?,?,?);`, [username, email, hasedPassword]);

  if (resultObject && resultObject.affectedRows == 1){
    return res.redirect('/login');
  }else{
    return res.redirect('/register');
  }
  }catch(error){
    next(error);
  }


});

router.post("/login", async function (req, res, next){
    const {username, password } = req.body;
    if (!username || !password) {
      return res.redirect("/login");
    }else{
      var [rows, fields] = await db.execute(
        `select id,username from users where username=? and password=?;` ,
        [username]
      );
      var user = rows[0];
      if (!user) {
        return res.redirect("/login");
      }else {
        var passwordsMatched = await bcrypt.compare(password, user.password);
        if(passwordsMatched){
          req.session.user = {
            userId: user.id,
            email: user.email,
            username: user.username
          };
          return res.redirect("/");
        }else{
        return res.redirect("/login");
      }
      }
    }
});

router.get("/profile/:id(\\d+)", function(req, res){
  res.render("profile");
});
router.post("/logout", function (req, res, next) {
  req.session.destroy(function(err){
    if(err){
      next(error);
    }
    return res.redirect('/');
  })
});*/

module.exports = router;

/*
  //check username unique
try{
  var[rows, fields] = await db.execute(`select id from users where username=?;`, [username]);
  console.log(rows);
  if (rows && rows.length > 0){
    return res.redirect('/register');
  }
  var[rows, fields] = await db.execute(`select id from users where email=?;`, [email]);
  console.log(rows);
  if (rows && rows.length > 0){
    return res.redirect('/register');
  }

  var [resultObject, fields] = await db.execute(`INSERT INTO users
  (username, email, password)
  value
  (?,?,?);`, [username, email, password]);

  console.log(resultObject);
  res.end();
}catch(error){
next(error);

}*/
