const jwt = require("jsonwebtoken");

//para limpiar la respuest de mongoose
exports.clearRes = (data) => {
  const { password, createdAt, updatedAt, __v, ...restData } = data;
  return restData;
};

exports.createJWT = (user) => {
  //jwt.sign({valor a encriptar}, palabraSecreta, {opciones})
  //todo eso retorna => akjefñaksvnnvwsivgh.ñoiecfhecnvhowi.123124241413
  return jwt
    .sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role, //verificar si es necesario
        //username: user.username
      },
      process.env.SECRET,
      { expiresIn: "24h" }
    )
    .split(".");
};
