const {transactions : Transactions, users} = require('../../models');
const Joi = require('joi');
const fs = require('fs');
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transactions.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            order: [['createdAt','DESC']],
            include: {
                model: users,
                as: "user",
                where : {
                    role : 1,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt"],
                },
            },
        });

        if(!transactions){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    transactions: [],
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Transactions successfully get",
            data : {
                transactions
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

exports.getDetailTransactions = async (req,res) => {
    try {
        const {id} = req.params;
        const transaction = await Transactions.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where: {
                id,
            },
            include: {
                model: users,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        if(!transaction){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    transaction: null,
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Transaction successfully get",
            data : {
                transaction
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

//Add Incoming Transactions
exports.addTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const file = req.files; 
        const remainingActive = 0;
        const paymentStatus = "Pending";

        const {accountNumber} = body;
        const {proofTransaction} = file;

        const schema = Joi.object({
            proofTransaction : Joi.required().label("Transaction Attachment"),
            accountNumber: Joi.number().required().label("Account Number"),
        });

        const {error} = schema.validate({accountNumber, proofTransaction}, {
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

        if(!file.proofTransaction) {
            return res.status(401).send({
                status : "Validation Error",
                error: {
                    message: "File Empty",
                },
            });
        }

        try {
            const transaction = await Transactions.create({ 
                ...body,
                userId : id,
                proofTransaction: `${file.proofTransaction[0].fieldname}/${file.proofTransaction[0].filename}`,
                remainingActive: remainingActive,
                paymentStatus: paymentStatus,
            });
            if(transaction){
                    res.send({
                        status: responseSuccess,
                        message: "Transaction successfully created",
                        data: {
                            transaction,
                        },
                    });
                } 
        } catch (error) {
                const dirDelete = `uploads/${file.proofTransaction[0].fieldname}/${file.proofTransaction[0].filename}`;
                fs.unlinkSync(dirDelete, function(err) {
                    if(err) return console.error(err);
                });
            return res.status(500).send({
                error: {
                message: "Sorry, User ID Not Found",
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
// Edit Incoming Transaction 
exports.updateTransaction = async (req,res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const checkTransactionById = await Transactions.findOne({
            where : {
                id,
            },
        });

        if(!checkTransactionById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    Transaction : null,
                },
            });
        }

        const remainingActiveData = checkTransactionById.remainingActive;
        var remainingActiveUpdate = remainingActiveData;
        if(body.paymentStatus === 'Approved'){
            if(remainingActiveData === 0){
                remainingActiveUpdate = 30 + remainingActiveData;
            }
        }
        const transaction = await Transactions.update({
            paymentStatus : req.body.paymentStatus,
            remainingActive : remainingActiveUpdate,
        },{where : { id,}});

        const getTransactionAfterUpdate = await Transactions.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where : {
                id,
            },
            include: {
                model: users,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        res.send({
            status: responseSuccess,
            message: "Transaction Successfully update",
            data : {
                transaction: getTransactionAfterUpdate,
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
exports.deleteTransaction = async (req,res) => {
    try {
        const {id} = req.params;
        const checkTransactionById = await Transactions.findOne({
            where : {
                id,
            },
        });

        if(!checkTransactionById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    checkTransactionById: null,
                },
            });
        }
        const getFile = checkTransactionById.proofTransaction;
        const dirDelete = `uploads/${getFile}`;
        fs.unlinkSync(dirDelete, function(err) {
            if(err) return console.error(err);
        });

        await Transactions.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Transaction id ${id} Successfully Deleted`,
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

//Check Transaction
exports.getTransactionsByUserId = async (req, res) => {
    try {
        const {id} = req.params;
        const transactions = await Transactions.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        where : {
            userId : id,
            paymentStatus : "Approved",
        },
        include: {
            model: users,
            as: "user",
            attributes: {
                exclude: ["createdAt", "updatedAt","deletedAt","password"],
            },
        },
      });
  
      res.send({
        status: responseSuccess,
        message: `Transactions sucessfully loaded`,
        data: {
            transactions,
        },
      }); 
    } catch (err) {
      //error here
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
  };

  exports.FetchTransactionsByUserId = async (req, res) => {
    try {
        const {id} = req.params;
        const transactions = await Transactions.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        where : {
            userId : id,
        },
        include: {
            model: users,
            as: "user",
            attributes: {
                exclude: ["createdAt", "updatedAt","deletedAt","password"],
            },
        },
      });
  
      res.send({
        status: responseSuccess,
        message: `Transactions sucessfully loaded`,
        data: {
            transactions,
        },
      }); 
    } catch (err) {
      //error here
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
  };