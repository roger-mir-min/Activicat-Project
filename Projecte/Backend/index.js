const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-north-1'
});

const imgRoutes = require('./Img_upload/routes');
const accountRoutes = require('./Account/routes');
const exercisesRoutes = require('./Exercises/routes');
const deures_activitatsRoutes = require('./Deures_activitats/routes');
const groupsRoutes = require('./Groups/routes');

const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3306;  

// Rutes
app.use(imgRoutes)
app.use(accountRoutes);
app.use(exercisesRoutes);
app.use(deures_activitatsRoutes);
app.use(groupsRoutes);

// Iniciar el servidor
app.listen(port, () => {
   console.log(`API listening to port ${port}`);
});

//multer per a imatges
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

// Funció per gestionar els errors de connexió
// const handleDatabaseConnectionError = (err) => {
//     console.error('Error en connectar index a la base de dades:', err);
// };

// Intentar connectar-se a la base de dades
// db.connect((err) => {
//     if (err) {
//         handleDatabaseConnectionError(err);
//         return;
//     }
//     console.log('Connexió a la base de dades establerta amb èxit.');

// });




