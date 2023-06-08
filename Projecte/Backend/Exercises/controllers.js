const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

db.connect((err) => {
    if (err) {
        console.error('Error en connectar Exercises a la base de dades:', err);
        return;
    }
    console.log('Exercises ha establert connexió amb la base de dades.');
});

exports.getAllActivitats = (req, res) => {
const query = 'SELECT * FROM activitats';

db.query(query, (err, results) => {
    if (err) {
        console.error('Error en obtenir les activitats:', err);
        res.status(500).send('Error en obtenir les activitats');
        return;
    }

        res.json(results);
    });
};


exports.getActivitatById = (req, res) => {
const id = req.params.id;
const query = 'SELECT * FROM activitats WHERE id_activitat = ?';

db.query(query, [id], (err, results) => {
    if (err) {
        console.error('Error en obtenir activitat:', err);
        res.status(500).send('Error en obtenir activitat');
        return;
    }

    if (results.length === 0) {
        res.status(404).send('Actividad no trobada');
    } else {
        res.json(results[0]);
    }
    });
};

exports.getActivitatsByAmbit = (req, res) => {
const ambit = req.params.ambit;
const query = 'SELECT * FROM activitats WHERE ambit = ?';

db.query(query, [ambit], (err, results) => {
    if (err) {
        console.error('Error en obtenir activitat:', err);
        res.status(500).send('Error en obtenir activitat');
        return;
    }

    if (results.length === 0) {
        res.status(404).send('Actividad no trobada');
    } else {
        res.json(results);
    }
});
};

exports.getActivitatsByTema = (req, res) => {
const tema = req.params.tema;
const query = 'SELECT * FROM activitats WHERE tema = ?';

db.query(query, [tema], (err, results) => {
    if (err) {
        console.error('Error en obtenir activitat:', err);
        res.status(500).send('Error en obtenir activitat');
        return;
    }

    if (results.length === 0) {
        res.status(404).send('Actividad no trobada');
    } else {
        res.json(results[0]);
    }
});
};


exports.getActivitatsBySubtema = (req, res) => {
const subtema = req.params.subtema;
const query = 'SELECT * FROM activitats WHERE subtema = ?';

db.query(query, [subtema], (err, results) => {
    if (err) {
        console.error('Error en obtenir activitat:', err);
        res.status(500).send('Error en obtenir activitat');
        return;
    }

    if (results.length === 0) {
        res.status(404).send('Actividad no trobada');
    } else {
        res.json(results);
    }
});
};

exports.getMaxNumberBySubtema = (req, res) => {
    const subtema = req.params.subtema;
    const query = 'SELECT MAX(number) as max_number FROM activitats WHERE subtema = ?';

    db.query(query, [subtema], (err, results) => {
        if (err) {
            console.error('Error en obtenir el valor màxim de number:', err);
            res.status(500).send('Error en obtenir el valor màxim de number');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Cap activitat trobada per al subtema especificat');
        } else {
            res.json(results[0]);
        }
    });
};

exports.getActivitatBySubtemaAndNumber = (req, res) => {
    const subtema = req.params.subtema;
    const number = req.params.number;
    const query = 'SELECT * FROM activitats WHERE subtema = ? AND number = ?';

    db.query(query, [subtema, number], (err, results) => {
        if (err) {
            console.error('Error en obtenir activitat:', err);
            res.status(500).send('Error en obtenir activitat');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Actividad no trobada');
        } else {
            res.json(results[0]);
        }
    });
};