var express = require("express");
var router = express.Router();
const multer = require("multer");
const sharp = require('sharp');
var db = require('../conf/database');

const { makeThumbnail, getRecentPosts, getPostById, getCommentsForPostById } = require("../middleware/posts");
const { isLoggedIn } = require("../middleware/auth");
const { use } = require(".");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
        var fileExt = file.mimetype.split("/")[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${file.fieldname}- ${uniqueSuffix}.${fileExt}`);
    },
  });
  
  const upload = multer({ storage: storage });


router.post( "/create",isLoggedIn, upload.single("uploadVideo") , async function(req, res, next){
    var { title, description} = req.body;
    var { path} = req.file;
    var { userId } = req.session;

    try{
        var[insertResult, _ ] = await db.execute(
            `INSERT INTO posts (title, video, text, thumbnail, fk_userId, description) VALUE (?,?,?,?,?, ?);`,
            [title,path,'text','destinationOfThumbnail', userId,description]
            );
            if(insertResult && insertResult.affectedRows){
                req.flash("success", "Your post was created!");
                return req.session.save(function(error){
                    if(error) next(error);
                    return res.redirect(`/`);
                })

            }else{
                next(new Error('Post could not be created'));
            }

    }catch(error){
        next(error);
    }
    console.log(req.file);
    console.log(req.body);
    res.end();
});
router.get('/:id(\\d+)', function(req,res){
    res.render('viewpost', {title: `View Post ${req.params.id}`});
  });


/*
router.get("/search", function(req,res, next){
    let searchTerm = `%${req.query.searchTerm}%`;
    let originalSearchTerm = req.query.searchTerm;
    let baseSQL = `select
    id, title, description, thumbnail, concat_ws(" ", title, description) as
    haystack
    From posts
    Having haystack like ?;`;
    db.execute(baseSQL,[searchTerm])
    .then(function([results,fields]){
        res.locals.results = results;
        res.locals.searchValue = originalSearchTerm;
        req.flash("success", `${results.length} results found`);
        req.session.save(function(saveErr){
            res.render('searchPage');
        })
    })
});*/




router.get('/search', async function(req,res,next){
    var {searchValue} = req.query;
    try{
        var [rows, _ ] = await db.execute(
            `select id ,title,thumbnail, concat_ws(' ', title, description) as haystack
            from posts
            having haystack like ?;`,
            [`%${searchValue}%`]
        );

        if(rows && rows.length == 0){
            getRecentPosts;

        }else{
            res.locals.posts = rows;
            return res.render('searchPage');
        }

    }catch(error){
        next(error);
    }
    
    
    
});




/*
router.post("/create", upload.single("uploadVideo"),makeThumbnail, function(req,res,next){
    var { title, description} = req.body;
    var { path, thumbnail} = req.file;
    var { userId } = req.session;

    console.log(userId);
    console.log(title);
    console.log(description);
    console.log(path);
    console.log(thumbnail);


    
    //console.log(req.session.userId);
    res.end();
})
*/











module.exports = router;
