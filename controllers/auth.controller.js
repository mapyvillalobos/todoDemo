//importar el model que voy a usar v1
const User = require("../models/User.model");
const mongoose = require("mongoose");

//Para el password
const bcryptjs = require("bcryptjs");
const {clearRes, createJWT} = require ("../utils/utils");
const { use } = require("../routes/auth.routes");

//login, signup, logout

//para las apis mandamos data en post
//get solo llamamos data


//signup controller

exports.signupProcess = (req, res, next) => {
  //params :id
  //query ?
  //frontend al back llega en el body

  const { role, email, password, confirmPassword, ...restUser } = req.body;
  //validaar campos vacios
  if (!email.length || !password.length || !confirmPassword.length)
    // Validar si el password >8 o con una regla regex
    return res
      .status(400)
      .json({ errorMessage: "Llena todos los campos obligatorios" });

  //validar que el campo coincida
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ errorMessage: "Las contraseñas deben coincidir" });

  //Validar si el email existe antes
  User.findOne({ email })
    .then((found) => {
      if (found)
        return res.status(400).json({ errorMessage: "Ese usuario ya existe" });

      return (
        bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            //creamos al nuevo usuario
            return User.create({
              email,
              password: hashedPassword,
              ...restUser,
            });
          })
          //then contiene al user ya con password hashed y guardado en la base de datos
          .then((user) => {
            //regresamos al usuario para que entre a la pñaginay crear su token de acceso
            const [header, payload, signature] = createJWT(user);

            //vamos a guardar estos datos en las cookies
            //res.cookie("key_como_se_va_a_guardar", "dato_que_voy_a_almacenar", {opciones})
            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 30, //24 horas
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });

            res.cookie("signature", signature, {
              maxAge: 1000 * 60 * 30, //24 horas
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });

            /**
             * user = {
             * firstName:...,
             * lastName:...,
             * password:56uysdhcwsw4r
             * }
             * toObject()
             * {} objeto || JSON
             * {} BSON => toObject () => Objeto ..., {perro, gato}, delete user.password
             */

            /**
             * respuesta en frontend
             * res.data ={
             * result:{
             * user:{...},
             * listFrienda:[{...}, {...}]
             * }
             * }
             */

            //vamos a limpar la respuesta de mongoose conviertiendo el BSON a objeto y eliminar data basura
            const newUser = clearRes(user.toObject());
            res.status(201).json({ user: newUser }); // {data: {user: {} } }
          })
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Este correo ya está resgistrado",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.loginProcess = (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password || !email.length || !password.length) return res
      .status(400)
      .json({ errorMessage: "Llena todos los campos obligatorios" });

      //validar el password > 8 o colocar el regex

      User.findOne({email})
      .then(user => {
        //ver si correo existe
        if(!user) return res
          .status(400)
          .json({ errorMessage: "Correo y/o contraseña inválidas" });

        //ver si la contraseña es correcta
        return bcryptjs.compare(password, user.password)
        .then(match => {
            if(!match) return res
              .status(400)
              .json({ errorMessage: "Correo y/o contraseña inválidas" });

              //crear nuestro jwt
              const [header, payload, signature] = createJWT(user)

              res.cookie("headload", `${header}.${payload}`, {
                maxAge: 1000 * 60 * 30, //24 horas
                httpOnly: true,
                sameSite: "strict",
                secure: false,
              });

              res.cookie("signature", signature, {
                maxAge: 1000 * 60 * 30, //24 horas
                httpOnly: true,
                sameSite: "strict",
                secure: false,
              });
              //vamos a limpiar el response del usuario
              const newUser = clearRes(user.toObject())
              res.status(200).json({user:newUser})
        })
      })
.catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Este correo ya está resgistrado",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.logoutProcess = (req, res, next) => {
    res.clearCookie('headload');
    res.clearCookie('signature');
    res.status(200).json({successMessage:"Sesión cerró correctamente. Te esperamos pronto!"})
}