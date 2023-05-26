var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
const db = require('../conf/database');



module.exports = {
    makeThumbnail: function(req,res,next){
        if(!req.file){
            next(new Error('File upload error!'));

        }else{
            try{
            var destinationOfThumbnail = `public/images/uploads/thumbnail-${
                req.file.filename.split(".")[0]
            }.png`;
            var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y 
            -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
            exec(thumbnailCommand);
            req.file.thumbnail = destinationOfThumbnail;
            next();
            }
            catch (error){
                next(error);

            }
        }
    },
    getRecentPosts: function(req,res,next){
        db.query(`select id, title, description,thumbnail from posts ORDER
         BY createdAt DESC LIMIT 2`)
        .then(function([results,fields]){
            if(results && results.length){
                res.locals.results = results;
            }
            next();
        })
        .catch(err => next(err));
    },

    getPostById: async function ( req,res,next){
        var {id} = req.params;

        try{
            let [ rows, _] = await db.execute(
                `SELECT u.username, p.video, p.title, p.description, p.id
                from posts p
                JOIN users u
                ON p.fk_userId = u.id
                WHERE p.id = ?;`,
                 [id]
            );
            const post = rows[0];
            if(!post){
                return res.status(404).json({error: 'Post not found' });

            }
            else{
                res.locals.currentPost = id;
                next();
            }
        }catch(error){
            next(error);
        }
        
    },
    /*getCommentsForPostById: async function(req,res,next){
        var {id} = req.params;

        try{
            let [ rows, _] = await db.execute(
                `SELECT u.username, c.text, c.createdAt
                from comments c
                JOIN users u
                ON c.fk_authorId = u.id
                WHERE c.dk_postId = 1;`,
                 [id]
            );
            res.locals.currentPost.comments = rows;
            next();
        }catch(error){
            next(error);
        }
    }*/


};