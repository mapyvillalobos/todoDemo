const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true, //[true, "Este correo ya pertenece a unusuario"]
      match: [/^\S+@\S+\.\S+$/, "Ingresa un correo válido"],
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    firstName: {
      type: String,
      minlength: 1,
    },
    lastName: {
      type: String,
      require: true,
    },
    imageURL: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
