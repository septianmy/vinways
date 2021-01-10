const Joi = require("joi");
const fs = require('fs');
const { users } = require("../../models");
const bcrypt = require("bcrypt");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getUsers = async (req, res) => {
    try {
        const user = await users.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            }
        });
        if(!user){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    user: [],
                }
            });
        }

        res.send({
            status : responseSuccess,
            data: {
                user,
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

exports.getDetailUser = async (req,res) => {
    try {
        const {id} = req.params;
        const user = await users.findOne({
            where: {
                id,
            },
        });

        if(!user){
            return res.status(400).send({
                status : resourceNotFound,
                message : `User with id: ${id} not found`,
                data: {
                    user: null,
                }
            });
        }

        res.send({
            status : responseSuccess,
            message : "Data Successfully get",
            data : {
                user,
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
}

exports.updateUser = async (req,res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const file = req.files;
    
        const checkUserById = await users.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            },
            where : {
                id,
            },
        });

        if(!checkUserById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `User with id: ${id} not found`,
                data: {
                    user: null,
                },
            });
        }

        if(file.profilePicture){
            if(checkUserById.dataValues.profilePicture !== null){
                const profilePictureDelete = `uploads/${checkUserById.dataValues.profilePicture}`;
                fs.unlinkSync(profilePictureDelete, function(err) {
                if(err) return console.error(err);
                });
            }
        }

        const user = await users.update(
            {
                ...body,
                profilePicture : file.profilePicture ? `${file.profilePicture[0].fieldname}/${file.profilePicture[0].filename}` : checkUserById.dataValues.profilePicture,
            },
            {
                where: {
                    id,
                },
            }
        );

        const getUserAfterUpdate = await users.findOne({
            attributes : {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            },
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: "User Successfully update",
            data : {
                getUserAfterUpdate
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

exports.deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        const getUserById = await users.findOne({
            where : {
                id,
            },
        });

        if(!getUserById) {
            return res.status(400).send({
                status : `User with id: ${id} not found`,
                data: {
                    user: null,
                },
            });
        }

        await users.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `User id ${id} Successfully Deleted`,
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

//soft deleted
exports.restoreUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await users.restore({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `User id ${id} Successfully restored`,
            data : {
                user,
            },
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

exports.changePasword = async (req,res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        const schema = Joi.object({
            oldpassword : Joi.string().min(6).required(),
            newpassword : Joi.string().min(6).required(),
            retypepassword : Joi.string().min(6).required(),
        });
    
        const {error} = schema.validate(body, {
            abortEarly:false,
        });

        if (error){
            return res.status(400).send({
                status : "Validation Error",
                error : {
                    message: error.details.map((error) => error.message),
                }
            })
        };
            
        var { oldpassword, newpassword, retypepassword } = body;
        //fetch data user
        const user = await users.findOne({
            where : { 
                id,
            },
        });

        //cek user
        if(!user){
            return res.status(401).send({
                status: "Login Failed",
                error : {
                    message : "User not Found",
                }, 
            });
        }
        const validOldPass = await bcrypt.compare(oldpassword, user.password);

        if(!validOldPass){
            return res.status(401).send({
                status: "Login Failed",
                error: {
                    message: "Old Password is not match with your current password",
                }, 
            });
        }

        if(newpassword !== retypepassword)
        {
            return res.status(401).send({
                status: "Login Failed",
                error: {
                    message: "New Password is not match with Re-type Password",
                }, 
            });
        }

        //encrypt password baru
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const changePass = await users.update( {password : hashedPassword}, {
            where: {
                id,
            },
        });
            res.send({
                status : "Success",
                message : "Your Password successfully changed"
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