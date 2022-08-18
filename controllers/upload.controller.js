const cloudinary = require("cloudinary");

exports.uploadProcess = async (req, res, next) => {
  const uploads = (file, folder) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(file, (result) => {
        resolve(
          {
            url: result.url,
            id: result.original_filename,
          },
          {
            resource_type: "auto",
            folder,
          }
        );
      }); // end cloudinary
    }); // end new promise
  }; //end uploads
  // es la llave del json donde va a contener la imagen
  const uploader = async (path) => uploads(path, "images");
  if (req.method === "POST") {
    const urls = [];
    const files = req.files;
    // req.files  .array()
    // req.file   .single()
    if (!req.file) {
      for (const file of files) {
        //for of array string  -- for in Objects
        const { path } = file;
        const newPath = await uploader(path)
        urls.push({uri:newPath.url, id:newPath.id, name:file.originalname})
      }

      res.status(200).json({urls, sucessMessage: "Imágenes guardadas"})
    } else {
        const { path } = req.file;
        const newPath = await uploader(path);
        const url = {
          uri: newPath.url,
          id: newPath.id,
          name: req.file.originalname,
        };
        res.status(200).json({ url, sucessMessage: "Imagen guardada" });
    }
  }else{
    res.status(400).json({ errorMessage: `${req.method} no permitido!` });
  }
};

exports.deleteImage = (req, res, next) => {
    const {name} = req.params
                            //folder/imageName.ext
    cloudinary.v2.uploader.destroy(`tinder-perritos/${name}`, (error, result)=> {
        if (error){
            return res.status(400).json({errorMessage:"No se pudo eliminar", error})
        }
        res.status(200).json({sucessMessage: `Se eliminó el archivo ${name}`})
    })
}