//Importamos el modelo
const User = require("../models/User.model");
const { clearRes } = require("../utils/utils");
const mongoose = require("mongoose");

exports.getLoggedUser = (req, res, next) => {
  //User.findById(req.user._id)
  res.status(200).json({ user: req.user });
};

exports.editProfile = (req, res, next) => {
  //destructuramos el rol para que no puedan cambiarlo
  const { role, password, ...restUser } = req.body;
  //destructurar del req.user = {_id}
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { ...restUser }, { new: true })
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Hubo un error",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//http://www.tinderPerritos.com/api/user/23454365765868/profile
//params
//query string ? key=perrito
exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Hubo un error",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//esta es para el admin
exports.onlyAdminRead = (req, res, next) => {
  User.find(
    { role: { $ne: "Admin" } },
    { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
  )
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Hubo un error",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//Borrar la cuenta del usuario logueado
exports.deleteAccount = (req, res, next) => {
  //destructurar el req.user
  const { _id } = req.user;
  User.findByIdAndRemove(_id)
    .then(() => {
      res.clearCookie("headload");
      res.clearCookie("signature");
      res.status(200).json({ sucessMessage: "usuario borrado correctamente" });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Hubo un error",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};
