const router = require("express").Router();

//importar el controlador
const {
  uploadProcess,
  deleteImage,
} = require("../controllers/upload.controller");

//importar mi helper
const uploadCloud = require("../helpers/cloudinary");

//middleware para verificar si estás logueado
const { verifyToken } = require("../middleware");

//multiples
router.post(
  "/uploads",
  uploadCloud.array("images", 3),
  uploadProcess
);

//una sola
router.post("/single", uploadCloud.single("image"), uploadProcess);

//delete Image
router.delete("/delete-image/:name", verifyToken, deleteImage);

module.exports = router;
