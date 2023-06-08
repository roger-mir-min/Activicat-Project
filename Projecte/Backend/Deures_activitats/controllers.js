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
        console.error('Error en connectar Deures_activitats a la base de dades:', err);
        return;
    }
    console.log('Deures_activitats ha establert connexió amb la base de dades.');
});

exports.addDeuresActivitats = (req, res) => {
   const newDeuresActivitats = req.body;

    const query = 'INSERT INTO deures_activitats SET ?';

    db.query(query, newDeuresActivitats, (err, results) => {
        if (err) {
            console.error('Error en afegir objecte a Deures_activitats:', err);
            res.status(500).send('Error en afegir objecte a Deures_activitats');
            return;
        }

        res.status(201).json({ id: results.insertId, ...newDeuresActivitats });
    });
};

exports.getUserPointsById = (req, res) => {
    const id = req.params.user_id;
    const query = 'SELECT points FROM usuaris WHERE user_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error en obtenir els punts:', err);
            res.status(500).send('Error en obtenir els punts');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Usuario no trobat');
        } else {
            res.json(results[0]);
        }
    });
};

exports.getSumaPuntsByUsuariAndAmbit = (req, res) => {
    const usuari_id = req.params.user_id;
    const ambit = req.query.ambit;

    let query = 'SELECT SUM(da.punts) AS punts_totals FROM deures_activitats da JOIN activitats a ON da.activitat_id = a.id_activitat WHERE da.usuari_id = ?';
    let queryParams = [usuari_id];

    if (ambit) {
        query += ' AND a.ambit = ?';
        queryParams.push(ambit);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error en obtenir la suma de punts dels deures_activitats per usuari i àmbits especificats:', err);
            res.status(500).send('Error en obtenir la suma de punts dels deures_activitats per usuari i àmbits especificats');
            return;
        }

        const puntsTotals = results[0].punts_totals || 0;
        res.json(puntsTotals.toString());
    });
};


exports.getDeuresActivitatsByUserId = (req, res) => {
  const { user_id } = req.params;
  const is_completed = parseInt(req.query.is_completed);

  let query = `
    SELECT da.*, a.subtema, a.ambit
    FROM deures_activitats da
    JOIN activitats a ON da.activitat_id = a.id_activitat
    WHERE da.usuari_id = ?
  `;
  const queryParams = [user_id];

  if (is_completed === 0 || is_completed === 1) {
    query += ' AND da.is_completed = ?';
    queryParams.push(is_completed);
  } else if (!isNaN(is_completed)) {
    res.status(400).send('Valor invàlid per a is_completed');
    return;
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error en obtenir els deures:', err);
      res.status(500).send('Error en obtenir els deures');
      return;
    }

    const deuresWithSubtemaAndAmbit = results.map((deure) => {
      return {
        ...deure,
        subtema: deure.subtema,
        ambit: deure.ambit
      };
    });

    res.json(deuresWithSubtemaAndAmbit);
  });
};


exports.getDeuresByUserId = (req, res) => {
  const { user_id } = req.params;
  const { is_completed } = req.query;

  let query = `SELECT DISTINCT deures.*,
                grup.nom AS nom_grup,
                usuaris.nom AS nom_profe,
                da.activitat_id
                FROM deures_activitats da
                JOIN deures ON da.deure_id = deures.id_deure
                JOIN grup ON deures.grup_id = grup.id_grup
                JOIN usuaris ON grup.profe_id = usuaris.user_id
                WHERE da.usuari_id = ?`;

  const queryParams = [user_id];

  if (is_completed === '0' || is_completed === '1') {
    query += ' AND da.is_completed = ?';
    queryParams.push(parseInt(is_completed));
  } else if (is_completed !== undefined) {
    res.status(400).send('Valor invàlid per a is_completed');
    return;
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error en obtenir els deures per usuari i is_completed:', err);
      res.status(500).send('Error en obtenir els deures per usuari i is_completed');
      return;
    }

    res.json(results);
  });
};

exports.updateDeuresActivitats = (req, res) => {
  const { deure_id, activitat_id, usuari_id } = req.query;
  const { resp_usuari, punts, num_errors, completed_at } = req.body;

  if (resp_usuari === undefined || punts === undefined || num_errors === undefined || !completed_at) {
    res.status(400).send('Faltan campos requeridos');
    return;
  }

  const query = `
    UPDATE deures_activitats
    SET resp_usuari = ?, punts = ?, num_errors = ?, completed_at = ?, is_completed = 1
    WHERE deure_id = ? AND activitat_id = ? AND usuari_id = ?
  `;

  db.query(query, [resp_usuari, punts, num_errors, completed_at, deure_id, activitat_id, usuari_id], (err, results) => {
    if (err) {
      console.error('Error en actualitzar objecte a Deures_activitats:', err);
      res.status(500).send('Error en actualitzar objecte a Deures_activitats');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Objecte no trobat');
      return;
    }

    res.sendStatus(204);
  });
};

exports.getDeuresByProfeId = (req, res) => {
  const id_profe = req.params.id_profe;
  const is_checked = req.query.is_checked;

  let query = `
  SELECT d.*, g.nom as nom_grup, da.activitat_id
  FROM deures d
  INNER JOIN grup g ON d.grup_id = g.id_grup
  INNER JOIN deures_activitats da ON d.id_deure = da.deure_id
  WHERE g.profe_id = ?`;

  let params = [id_profe];

  if (is_checked !== undefined) {
    query += ' AND d.is_checked = ?';
    params.push(is_checked);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error en obtenir els objectes de Deures:', err);
      res.status(500).send('Error en obtenir els objectes de Deures');
      return;
    }

    res.send(results);
  });
};

exports.getDeuresActivitatsByDeureId = (req, res) => {
  const { id_deure } = req.params;

  const query = `
    SELECT da.*, usuaris.nom AS nom_user, d.data_finalitzacio
    FROM deures_activitats da
    INNER JOIN usuaris ON da.usuari_id = usuaris.user_id
    INNER JOIN deures d ON da.deure_id = d.id_deure
    WHERE da.deure_id = ?
  `;

  db.query(query, [id_deure], (err, results) => {
    if (err) {
      console.error('Error en obtenir objectes de la taula "deures_activitats":', err);
      res.status(500).send('Error en obtenir objectes de la taula "deures_activitats"');
      return;
    }

    res.send(results);
  });
};

exports.updateDeureIsChecked = (req, res) => {
    const id_deure = req.params.id_deure;
    const isChecked = req.body.is_checked;

    if (isChecked === undefined) {
        res.status(400).send('Falta el valor de is_checked al cos de la sol·licitud');
        return;
    }

    const query = 'UPDATE deures SET is_checked = ? WHERE id_deure = ?';

    db.query(query, [isChecked, id_deure], (err, results) => {
        if (err) {
            console.error('Error en actualitzat la propietat is_checked a objecte Deures:', err);
            res.status(500).send('Error en actualitzat la propietat is_checked a objecte Deures');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Deure no trobat');
            return;
        }

        res.sendStatus(204);
    });
};

exports.getDeuresActivitatsByUserAndProfe = (req, res) => {
  const { usuari_id, profe_id, is_completed } = req.query;

  const query = `
    SELECT deures_activitats.*, activitats.ambit, activitats.tema, activitats.subtema
    FROM deures_activitats 
    INNER JOIN deures ON deures_activitats.deure_id = deures.id_deure 
    INNER JOIN grup ON deures.grup_id = grup.id_grup 
    INNER JOIN activitats ON deures_activitats.activitat_id = activitats.id_activitat
    WHERE grup.profe_id = ? AND deures_activitats.usuari_id = ? ${is_completed ? 'AND deures_activitats.is_completed = ?' : ''}
  `;

  const queryParams = [profe_id, usuari_id];
  if (is_completed) {
    queryParams.push(is_completed);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error en obtenir les activitats dels deures:', err);
      res.status(500).send('Error en obtenir les activitats dels deures');
      return;
    }

    if (results.length === 0) {
      res.json([]); 
      return;
    }

    res.json(results);
  });
};


exports.createDeureAutoId = (req, res) => {
  const deure = req.body;

  const query = `INSERT INTO deures SET ?`;

  db.query(query, deure, (err, result) => {
    if (err) {
      console.error('Error en crear el deure:', err);
      res.status(500).send('Error en crear el deure');
      return;
    }

    const queryGet = `SELECT * FROM deures WHERE id_deure = ?`;
    db.query(queryGet, [result.insertId], (err, resultGet) => {
      if (err) {
        console.error('Error en obtenir objecte inserit:', err);
        res.status(500).send('Error en obtenir objecte inserit');
        return;
      }

      res.json(resultGet[0]);
    });
  });
};

exports.deleteDeure = (req, res) => {
  const { id_deure } = req.params;

  const query = 'DELETE FROM deures WHERE id_deure = ?';

  db.query(query, id_deure, (err, result) => {
    if (err) {
      console.error('Error en eliminar el deure:', err);
      res.status(500).send('Error en eliminar el deure');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Deure no trobat');
    } else {
      res.status(200).send('Deure eliminat correctament');
    }
  });
};

exports.deleteDeurActByDeureIdAndIncompleted = (req, res) => {
  const { deure_id } = req.params;

  const query = 'DELETE FROM deures_activitats WHERE deure_id = ? AND is_completed = 0';

  db.query(query, deure_id, (err, result) => {
    if (err) {
      console.error('Error en eliminar les activitats dels deures:', err);
      res.status(500).send('Error en eliminar les activitats dels deures');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Actividats de deure no trobades');
    } else {
      res.status(200).send('Actividades de deure eliminades correctament');
    }
  });
};














