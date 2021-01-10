const Joi = require("joi");
const fs = require('fs');
const {Op} = require('sequelize');
const { artist: Artists, musics: Musics } = require("../../models");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getArtists = async (req, res) => {
    try {
        const artists = await Artists.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            },
            order : [
                ['createdAt', 'DESC'],
            ]
        });
        if(!artists){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    artisData: [],
                }
            });
        }
        const records = artists.map(function(result) {
            const checkMusicByArtisId = Musics.findAll({
                attributes:{
                    exclude: ["createdAt", "updatedAt"],
                },
                where : {
                    artistId : result.dataValues.id,
                }
            });
        });
        res.send({
            status : responseSuccess,
            data: {
                artists,
            },
        });

    } catch (err){
        console.log(err);
        return res.status(500).send({
            error : {
                message: "Server Error",
            },
        });
    }  
};

exports.getDetailArtist = async (req,res) => {
    try {
        const {id} = req.params;
        const artist = await Artists.findOne({
            where: {
                id,
            },
        });

        if(!artist){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    artist: null,
                }
            });
        }

        res.send({
            status : responseSuccess,
            message : "Data Successfully get",
            data : {
                artist,
            }
        })

    } catch (err){
        console.log(err);
        return res.status(500).send({
            error : {
                message: "Server Error",
            },
        });
    }
};

exports.addArtist = async (req, res) => {
    try {
      const body = req.body;
      const file = req.files;

      const {name, old, category,startCareer} = body;
      const {artistThumbnail} = file;

      const schema = Joi.object({
          artistThumbnail : Joi.required().label('Artist Thumbnail'),
          name : Joi.string().min(2).required().label('Name Artist'),
          old: Joi.number().min(2).required().label('Old Artist'),
          category: Joi.string().min(2).required().label('Category Artist'),
          startCareer:Joi.number().required().label('Start a Career'),
      });

      //destruct error result dari validation 
      const {error} = schema.validate({artistThumbnail,name,old,category,startCareer}, {
          abortEarly: false,
      });

      //jika ada error stop disini dan kirim response error
      if (error) {
          if(file.artistThumbnail) {
                const thumbnailDelete = `uploads/${file.artistThumbnail[0].fieldname}/${file.artistThumbnail[0].filename}`;
                fs.unlinkSync(thumbnailDelete, function(err) {
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
  
      //method create menerima 1 parameter yaitu data yang mau diinsert
      const artist = await Artists.create({ 
            ...body, 
            thumbnail: `${file.artistThumbnail[0].fieldname}/${file.artistThumbnail[0].filename}`
        });
  
      //send jika oke
      res.send({
        status: responseSuccess,
        message: "Artist successfully created",
        data: {
            artist : {
                id : artist.id,
                name : artist.name,
                old : artist.old,
                category : artist.category,
                startCareer : artist.startCareer,
                thumbnail: artist.thumbnail
            }
        },
      });
    } catch (err) {
      console.log(err);
     
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
  };

//Update Artist
exports.updateArtist = async (req,res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const file = req.files;
        const {name, old, category,startCareer} = body;
        
        const checkArtistById = await Artists.findOne({
            where : {
                id,
            },
        });

        if(!checkArtistById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    artist: null,
                },
            });
        }

        const schema = Joi.object({
            name : Joi.string().min(2).required().label('Name Artist'),
            old: Joi.number().min(2).required().label('Old Artist'),
            category: Joi.string().min(2).required().label('Category Artist'),
            startCareer:Joi.number().required().label('Start a Career'),
        });
  
        //destruct error result dari validation 
        const {error} = schema.validate({name,old,category,startCareer}, {
            abortEarly: false,
        });
  
        //jika ada error stop disini dan kirim response error
        if (error) {
            if(file.artistThumbnail) {
                  const thumbnailDelete = `uploads/${file.artistThumbnail[0].fieldname}/${file.artistThumbnail[0].filename}`;
                  fs.unlinkSync(thumbnailDelete, function(err) {
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

        if(file.artistThumbnail){
            const artistThumbnailDelete = `uploads/${checkArtistById.dataValues.thumbnail}`;
            fs.unlinkSync(artistThumbnailDelete, function(err) {
                if(err) return console.error(err);
            });
        }

        const artist = await Artists.update( 
            {
                ...body,
                thumbnail : file.artistThumbnail ? `${file.artistThumbnail[0].fieldname}/${file.artistThumbnail[0].filename}` : checkArtistById.dataValues.thumbnail,
            }, 
            {
                where: {
                    id,
                },
            }
        );

        const getArtistAfterUpdate = await Artists.findOne({
            attributes : {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            },
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: "Artist Successfully update",
            data : {
                artist: getArtistAfterUpdate,
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

exports.deleteArtist = async (req,res) => {
    try {
        const {id} = req.params;
        const checkArtistById = await Artists.findOne({
            where : {
                id,
            },
        });

        if(!checkArtistById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    artist: null,
                },
            });
        }

        await Artists.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Artist id ${id} Successfully Deleted`,
            data : {
                id : checkArtistById.id
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

exports.checkMusicByArtisId = async (req,res) => {
    try {
        const {id} = req.params;
        const checkMusicByArtisId = await Musics.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            },
            where : {
                artistId : id,
            }
        });
        if(checkMusicByArtisId.length === 0) {
            res.send({
                status : responseSuccess,
                data: {
                    totalMusic : 0
                },
            });
        }
        
            res.send({
                status : responseSuccess,
                data: {
                    totalMusic : checkMusicByArtisId.length
                },
            });
            const records = checkMusicByArtisId.map(function(result) {});

    } catch (error) {
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
    
};

exports.deleteMusicByArtisId = async (req,res) => {
    try {
        const {id} = req.params;
        const checkMusicByArtisId = await Musics.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            },
            where : {
                artistId : id,
            }
        });
        if(checkMusicByArtisId.length === 0) {
            res.send({
                status : responseSuccess,
                data: {
                    totalDeleteMusic : 0
                },
            });

            //Delete Artist
            await Artists.destroy({
                where : {
                    id,
                },
            });
        } else {
            res.send({
                status : responseSuccess,
                data: {
                    totalDeleteMusic : checkMusicByArtisId.length
                },
            });

            //Delete File Music and Thumbnail

                const records = checkMusicByArtisId.map(function(result) {
                const thumbnailDelete = `uploads/${result.dataValues.thumbnail}`;
                const musicDelete = `uploads/${result.dataValues.attachment}`;
                fs.unlinkSync(thumbnailDelete, function(err) {
                    if(err) return console.error(err);
                });
                fs.unlinkSync(musicDelete, function(err) {
                    if(err) return console.error(err);
                });
            });

            // delete music by artist Id
            await Musics.destroy({
                where : {
                    artistId : id,
                },
            });
        }
    } catch (error) {
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
};

exports.restoreArtist = async (req,res) => {
    try {
       const {id} = req.params;
       const artist = await Artists.restore({
           where : {
               id,
           }
       });

       res.send({
           data: {
               artist,
           }
       })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
}

exports.getRestoreArtist = async (req,res) => {
    try {
       const artists = await Artists.findAll({
           attributes: {
               exclude : ['createdAt','updatedAt'],
           },
           order : [['createdAt','DESC']],
           where : {
               deletedAt : {
                   [Op.ne] : null,
               }
           },
           paranoid: false,
       });

       res.send ({
           data: {
               artists,
           }
       });
    } catch (error) {
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
}
