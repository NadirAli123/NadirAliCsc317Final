var express = require("express");
var router = express.Router();
var {isLoggedIn} = require('../middleware/auth');
const db = require('../conf/database');
const { post } = require(".");

router.post('/create', isLoggedIn, async function(req,res,next){
    let {comment,postId} = req.body;
    let {userId, username} = req.session;

    try{
        var [insertResult, _] = await db.execute(`INSERT INTO comments (text) VALUE (?)`,
         [comment]
        );
        if (insertResult && insertResult == 1){
            return res.status(201).json({
                username,
                comment,

            });
        }
    }catch(error){
        next(error);
    }
    console.log(comment);

});

module.exports = router;