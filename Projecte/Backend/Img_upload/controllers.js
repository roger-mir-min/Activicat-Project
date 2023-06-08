const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({  
  region: AWS_REGION
});

const s3 = new AWS.S3();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

db.connect((err) => {
    if (err) {
        console.error('Error en connectar Img_upload a la base de dades:', err);
        return;
    }
    console.log('Img_upload ha establert connexió amb la base de dades.');
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

//POST
exports.changeUserImg = [upload.single('profileImage'), (req, res) => {
  const user_id = req.body.user_id; 
  const file = req.file;

  // Obté la imatge anterior de l'usuari des de la base de dades
  db.query("SELECT img FROM usuaris WHERE user_id = ?", [user_id], function(err, result) {
    if (err) {
      console.error('Error en obtener la imagen anterior de la base de datos:', err);
      res.status(500).send({ error: 'Error interno del servidor en obtener la imagen anterior de la base de datos' });
    } else {
      // Verifica si hi ha una imatge anterior
      if (result.length > 0 && result[0].img) {
        const previousImageKey = result[0].img;

        const deleteParams = {
          Bucket: 'uploads-activicat',
          Key: previousImageKey
        };

        // Elimina la imatge anterior de S3
        s3.deleteObject(deleteParams, function(err, data) {
          if (err) {
            console.error('Error en eliminar la imagen anterior de S3:', err);
            res.status(500).send({ error: 'Error interno del servidor en eliminar la imagen anterior de S3' });
          } else {
            console.log('Imagen anterior eliminada de S3 correctamente.');
            uploadNewImage(user_id, file, res); // Puja la nova imatge al bucket de S3
          }
        });
      } else {
        uploadNewImage(user_id, file, res); // Puja la nova imatge al bucket de S3 si no hi ha imatge anterior
      }
    }
  });
}];

function uploadNewImage(user_id, file, res) {
  const fileExtension = path.extname(file.originalname);
  const uniqueFilename = `${user_id}-${Date.now()}${fileExtension}`;

  let previousImageKey;

  const params = {
    Bucket: 'uploads-activicat', 
    Key: uniqueFilename, 
    Body: fs.createReadStream(file.path),
    ACL: 'public-read'
  };

  db.query("SELECT img FROM usuaris WHERE user_id = ?", [user_id], function(err, result) {
    if (err) {
      console.error('Error en obtener la imagen anterior de la base de datos:', err);
      res.status(500).send({ error: 'Error interno del servidor en obtener la imagen anterior de la base de datos' });
    } else {
      if (result.length > 0 && result[0].img) {
        previousImageKey = result[0].img;

        const deleteParams = {
          Bucket: 'uploads-activicat',
          Key: previousImageKey
        };

        s3.deleteObject(deleteParams, function(err, data) {
          if (err) {
            console.error('Error en eliminar la imagen anterior de S3:', err);
            res.status(500).send({ error: 'Error interno del servidor en eliminar la imagen anterior de S3' });
          } else {
            console.log('Imagen anterior eliminada de S3 correctamente.');
            uploadToS3();
          }
        });
      } else {
        uploadToS3();
      }
    }
  });

  function uploadToS3() {
    s3.upload(params, function(err, data) {
      if (err) {
        console.error('Error en cargar el archivo a S3:', err);
        res.status(500).send({ error: 'Error interno del servidor en cargar el archivo a S3' });
      } else {
        console.log(`Archivo cargado correctamente. ${data.Location}`);

        db.query("UPDATE usuaris SET img = ? WHERE user_id = ?", [uniqueFilename, user_id], function(err, result) {
          if (err) {
            console.error('Error en actualizar la base de datos:', err);
            res.status(500).send({ error: 'Error interno del servidor en actualizar la base de datos' });
          } else {
            console.log('Base de datos actualizada correctamente.');
            res.send('Archivo cargado y base de datos actualizada correctamente.');
          }
        });
      }
    });
  }
}






//GET
exports.getUserImage = (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT img FROM usuaris WHERE user_id = ?";
  db.query(sql, [userId], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.message });
    } else {
      if (result.length > 0) {
        const imageKey = result[0].img; // Obtenir la ruta de la imatge des de la base de dades

        const s3Params = {
          Bucket: 'uploads-activicat',
          Key: imageKey
        };

        const s3Stream = s3.getObject(s3Params).createReadStream();

        s3Stream.on('error', function(err) {
          res.status(500).send({ error: 'Error intern del servidor en obtenir la imatge de l\'usuari' });
        });

        res.setHeader('Content-Type', 'image/jpeg');
        s3Stream.pipe(res);
      } else {
        res.status(404).send({ message: 'Usuari no trobat' });
      }
    }
  });
};

