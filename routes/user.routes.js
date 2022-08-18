const router = require("express").Router();

//Importar el controlador
const { getLoggedUser, editProfile, getUserById, onlyAdminRead, deleteAccount } = require("../controllers/user.controllers");

//Importar el middleware
const {verifyToken, checkRole} = require("../middleware")


//Read - perfil
router.get("/my-profile", verifyToken,getLoggedUser);

//Update - Perfil
router.patch("/edit-profile", verifyToken, editProfile);

//Delete - user
router.delete("/delete-user", verifyToken, deleteAccount);

//Read - otro usuario
router.get("/:id/profile", verifyToken, getUserById);

//Read all user (Admin Staff)
router.get("/admin/users", verifyToken, checkRole( ["Admin"] ), onlyAdminRead);


module.exports = router

