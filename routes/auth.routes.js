const router = require("express").Router();

//importar el controlador
const {signupProcess, loginProcess, logoutProcess} = require ("../controllers/auth.controller")

//importar middlewares


router.post("/signup", signupProcess);
router.post("/login", loginProcess);
router.get("/logout", logoutProcess)

module.exports = router;
