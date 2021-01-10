const { users } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(3).required().label("Fullname"),
            email: Joi.string().email().min(6).required().label("Email"),
            password: Joi.string().min(6).required().label("Password"),
        });

        const {error} = schema.validate(req.body, {
            abortEarly: false,
        });

        if(error) {
            return res.status(400).send({
                status : "Validation Error",
                error: {
                    message: error.details.map((error) => error.message),
                },
            });
        }

        const {fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        //Checking for duplicating username 
        const checkUserByEmail = await users.findOne({
            where : {
                email,
            },
        });

        if(checkUserByEmail) {
            return res.status(401).send({
                error: {
                    message: "Duplicate Email",
                },
            });
        }

        const user = await users.create({ ...req.body, password: hashedPassword, status:"not active", role:1 });
        const token = jwt.sign({ id : user.id }, "vinways");

        res.send({
            message : "Response Success",
            data : {
                user : {
                    
                    email,
                    token,
                }
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

exports.login = async (req,res) => {
    try {
        const {body} = req;
        const schema = Joi.object({
            email : Joi.string().email().min(6).required(),
            password : Joi.string().min(6).required(),
        });
        const {error} = schema.validate(body, {
            abortEarly:false,
        });

        if (error){
            return res.status(500).send({
                status : "Validation Error",
                error : {
                    message: error.details.map((error) => error.message),
                }
            })
        };
            
        const { email, password} = body;

        const user = await users.findOne({
            where : { 
                email,
            },
        });

        if(!user){
            return res.status(500).send({
                status: "Login Failed",
                error : {
                    message : "Invalid Login",
                }, 
            });
        }
        const validPass = await bcrypt.compare(password, user.password);

        if(!validPass){
            return res.status(500).send({
                status: "Login Failed",
                error: {
                    message: "Invalid Login",
                }, 
            });
        }

        const token = jwt.sign({ id: user.id }, "vinways");

        res.send({
            status : "Success",
            data: {
                channel : {
                    id : user.id,
                    role : user.role,
                    fullName : user.fullName,
                    profilePicture : user.profilePicture,
                    email,
                    token,
                }
            }
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

exports.checkAuth = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await users.findOne({
            where: {
                id: userId,
            },
        });

        res.send({
            status: "Response Success",
            message: "User Valid",
            data: user,
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