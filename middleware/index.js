//aqui vamos a crear un middleware que verifique si mi usuario está logueado
// y otro que verifique su rol

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { clearRes } = require("../utils/utils");

exports.verifyToken = (req, res, next) => {
  //1. Destructurar las cookies
  const { headload, signature } = req.cookies;

  if (!headload || !signature)
    return res.status(401).json({ erroMessage: "No estás autorizado" });

  //jwt.verify (jwt, SECRETWORD, (err, decoded)=>)
  jwt.verify(
    `${headload}.${signature}`,
    process.env.SECRET,
    (error, decoded) => {
      if (error) {
        return res.status(401).json({ erroMessage: "No estás autorizado" });
      }

      //decoded = {userId, role, email...}
      //findById
      User.findById(decoded.userId)
        .then((user) => {
          req.user = clearRes(user.toObject());
          next(); // el next da paso a mi siguiente acción en mi ruta
        })
        .catch((error) => {
          res.status(401).json({ erroMessage: "nelll" });
        });
    }
  ); // <- end verify
};

//["Admin"] || ["Admin", "Staff"]
exports.checkRole = (arrayRoles) => {
    return (req, res, next) => {
        
        //voy a sacar el rol req.user
        const {role} = req.user

        //validar si está este rol en el arreglo
        if(arrayRoles.icludes(role)){
            next()
        } else {
            res.status(401).json({ erroMessage: "No tienes permiso para realizar esta acción" });
        }
    }
}
