const express = require("express");
const router = express.Router();

//Controller
const { register, login, checkAuth } = require("../controllers/auth");
const { getUsers, deleteUser, restoreUser, updateUser, getDetailUser, changePasword } = require("../controllers/users");
const { getArtists, getDetailArtist, addArtist, deleteArtist, updateArtist, checkMusicByArtisId, deleteMusicByArtisId, getRestoreArtist, restoreArtist} = require("../controllers/artist");
const { getTransactions, getDetailTransactions, addTransaction, deleteTransaction, updateTransaction, getTransactionsByUserId, FetchTransactionsByUserId } = require("../controllers/transactions");

//middleware 
const {auth, userCheck} = require('../middleware/auth');
const {uploadImage} = require('../middleware/uploadImage');
const {uploadMusic} = require('../middleware/uploadMusic');
const { getMusics, getDetailMusic, addMusic, deleteMusic, updateMusic } = require("../controllers/music");

//Auth
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

//Users
router.get("/users",auth, getUsers);
router.get("/user/:id", auth, getDetailUser);
router.delete("/user/:id", auth, deleteUser);
router.post("/user/:id", auth, restoreUser);
router.put("/user/:id", auth, uploadImage('profilePicture',null), updateUser);
router.put("/change-password/:id", auth, changePasword); 

//Artists 
router.get("/artists", getArtists);
router.get("/artist/:id", auth, getDetailArtist);
router.get("/check-music-artist/:id", auth, checkMusicByArtisId);
router.delete("/delete-music-artist/:id", auth, deleteMusicByArtisId);
router.post("/artist", auth, uploadImage('artistThumbnail',null), addArtist);
router.patch("/artist/:id", auth, uploadImage('artistThumbnail',null), updateArtist);
router.delete("/artist/:id", auth, deleteArtist); //Soft Delete Artist

router.get("/restore-artists", auth, getRestoreArtist);
router.post("/artist/:id", auth, restoreArtist);


//Transactions
router.get("/transactions", auth, getTransactions);
router.get("/transaction/:id", auth, getDetailTransactions);
router.get("/check-transaction/:id", auth, getTransactionsByUserId);
router.get("/fetch-transaction-user/:id", auth, FetchTransactionsByUserId);
router.post("/transaction/:id",auth,uploadImage('proofTransaction',null),addTransaction );
router.patch("/transaction/:id",auth,updateTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);

//Musics
router.get("/musics",getMusics);
router.get("/music/:id",getDetailMusic);
router.post("/music", auth,uploadMusic("musicThumbnail","musicFile"), addMusic);
router.patch("/music/:id",auth,uploadMusic("musicThumbnail","musicFile"), updateMusic);
router.delete("/music/:id",auth,deleteMusic);

module.exports = router;