const router = require("express").Router();

//Importar el controlador
const { getLoggedUser, editProfile } = require("../controllers/user.controllers");

//Importar el middleware
const {verifyToken} = require("../middleware")


//Read - perfil
router.get("/my-profile", verifyToken,getLoggedUser);

//Update - Perfil
router.patch("/edit-profile", verifyToken, editProfile);

//Delete - user
//router.delete("/delete-user");

//Read - otro usuario
//router.get("/:id/profile")


module.exports = router