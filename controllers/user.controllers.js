//Importamos el modelo
const User = require("../models/User.model")
const { clearRes } = require("../utils/utils")

exports.getLoggedUser = (req, res, next) => {
    //User.findById(req.user._id)
    res.status(200).json({user:req.user})
}

exports.editProfile = (req, res, next) => {
    //destructuramos el rol para que no puedan cambiarlo
    const{role, password, ...restUser} = req.body
    //destructurar del req.user = {_id}
    const {_id} = req.user

    User.findByIdAndUpdate(_id, {...restUser}, {new:true})
    .then(user => {
        const newUser = clearRes(user.toObject())
        res.status(200).json({user:newUser})
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
}