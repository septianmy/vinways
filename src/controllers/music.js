const Joi = require("joi");
const fs = require('fs');
const { musics: Musics, artist} = require("../../models");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getMusics = async (req,res) => {
    try {
        const musics = await Musics.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            order : [
                ['createdAt', 'DESC'],
            ],
            include: {
                model: artist,
                as: "artists",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt"],
                },
            },
        });

        if(!musics){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    musics: [],
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Musics successfully get",
            data : {
                musics,
            },
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
                message: "Server Musics Error",
            },
        });
    }
};

//Get Detail Music
exports.getDetailMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const music = await Musics.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where: {
                id,
            },
            include: {
                model: artist,
                as: "artists",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        if(!music){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    music: null,
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Music successfully get",
            data : {
                music
            },
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};
//Add Music
exports.addMusic = async (req, res) => {
    try {
      const body = req.body;
      const file = req.files;

      const {title,year,artistId} = body;
      const {musicThumbnail, musicFile} = file;

      const schema = Joi.object({
          musicThumbnail : Joi.required().label('Music Thumbnail'),
          musicFile : Joi.required().label('Music File'),
          title : Joi.string().required().label('Music Title'),
          year : Joi.number().min(4).required().label('Music Year'),
          artistId : Joi.number().required().label('Artist'),
      });

      const {error} = schema.validate({musicThumbnail,musicFile,title,year,artistId}, {
          abortEarly: false,
      });
      
      if (error) {
        if(file.musicThumbnail) {
            const musicThumbnailDelete = `uploads/${file.musicThumbnail[0].fieldname}/${file.musicThumbnail[0].filename}`;
            fs.unlinkSync(musicThumbnailDelete, function(err) {
                if(err) return console.error(err);
            });
        }
        if(file.musicFile) {
            const musicFileDelete = `uploads/${file.musicFile[0].fieldname}/${file.musicFile[0].filename}`;
            fs.unlinkSync(musicFileDelete, function(err) {
                if(err) return console.error(err);
            });
        }

          return res.status(400).send({
              status : "Validation Error",
              error: {
                  message: error.details.map((error) => error.message),
              },
          });
      }

      try {
        const music = await Musics.create({ 
            ...body,
            thumbnail: `${file.musicThumbnail[0].fieldname}/${file.musicThumbnail[0].filename}`,
            attachment: `${file.musicFile[0].fieldname}/${file.musicFile[0].filename}`,
          },{ attributes : ['title','year','artistId','thumbnail','attachment']});
          if(music){
                res.send({
                    status: responseSuccess,
                    message: "Music successfully added",
                    data: {
                        music,
                    },
                });
            } 
      } catch (error) {
        if(file.musicThumbnail) {
            const musicThumbnailDelete = `uploads/${file.musicThumbnail[0].fieldname}/${file.musicThumbnail[0].filename}`;
            fs.unlinkSync(musicThumbnailDelete, function(err) {
                if(err) return console.error(err);
            });
        }
        if(file.musicFile) {
            const musicFileDelete = `uploads/${file.musicFile[0].fieldname}/${file.musicFile[0].filename}`;
            fs.unlinkSync(musicFileDelete, function(err) {
                if(err) return console.error(err);
            });
        }
            return res.status(500).send({
                error: {
                message: "Sorry, Artist ID Not Found",
                },
            });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
};

//Update Music
exports.updateMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const file = req.files;
  
        const {title,year,artistId} = body;
        const {musicThumbnail, musicFile} = file;

        const checkMusicById = await Musics.findOne({
            where : {
                id,
            },
        });

        if(!checkMusicById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    music: null,
                },
            });
        }

        const schema = Joi.object({
            title : Joi.string().required().label('Music Title'),
            year : Joi.number().min(4).required().label('Music Year'),
            artistId : Joi.number().required().label('Artist'),
        });
  
        const {error} = schema.validate({title,year,artistId}, {
            abortEarly: false,
        });
        
        if (error) {
          if(file.musicThumbnail) {
              const musicThumbnailDelete = `uploads/${file.musicThumbnail[0].fieldname}/${file.musicThumbnail[0].filename}`;
              fs.unlinkSync(musicThumbnailDelete, function(err) {
                  if(err) return console.error(err);
              });
          }
          if(file.musicFile) {
              const musicFileDelete = `uploads/${file.musicFile[0].fieldname}/${file.musicFile[0].filename}`;
              fs.unlinkSync(musicFileDelete, function(err) {
                  if(err) return console.error(err);
              });
          }
  
            return res.status(400).send({
                status : "Validation Error",
                error: {
                    message: error.details.map((error) => error.message),
                },
            });
        }

        if(file.musicThumbnail) {
            const musicThumbnailDelete = `uploads/${checkMusicById.dataValues.thumbnail}`;
            fs.unlinkSync(musicThumbnailDelete, function(err) {
                if(err) return console.error(err);
            });
        }
        if(file.musicFile) {
            const musicFileDelete = `uploads/${checkMusicById.dataValues.attachment}`;
            fs.unlinkSync(musicFileDelete, function(err) {
                if(err) return console.error(err);
            });
        }

        const music = await Musics.update( 
            {
            ...body,
            thumbnail : file.musicThumbnail ? `${file.musicThumbnail[0].fieldname}/${file.musicThumbnail[0].filename}` : checkMusicById.dataValues.thumbnail,
            attachment : file.musicFile ? `${file.musicFile[0].fieldname}/${file.musicFile[0].filename}` : checkMusicById.dataValues.attachment,
            }, 
            {
            where: {
                id,
            },
            }
        );

        const getMusicAfterUpdate = await Musics.findOne({
            attributes : {
                exclude: ["createdAt", "updatedAt"]
            },
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: "Music Successfully update",
            data : {
                music: getMusicAfterUpdate,
            }
        });
    } catch (err){
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
};

//Delete Incoming Transaction
exports.deleteMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const checkMusicById = await Musics.findOne({
            where : {
                id,
            },
        });

        if(!checkMusicById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    checkMusicById: null,
                },
            });
        }
        const getThumbnail = checkMusicById.thumbnail;
        const getMusicFile = checkMusicById.attachment;
        const thumbnailDelete = `uploads/${getThumbnail}`;
        const musicDelete = `uploads/${getMusicFile}`;
        
        fs.unlinkSync(thumbnailDelete, function(err) {
            if(err) return console.error(err);
        });
        fs.unlinkSync(musicDelete, function(err) {
            if(err) return console.error(err);
        });

        await Musics.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Music id ${id} Successfully Deleted`,
            data : {
                id : id,
            }
        });
    } catch (err){
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
};