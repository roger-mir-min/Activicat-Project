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
        console.error('Error en connectar Groups a la base de dades:', err);
        return;
    }
    console.log('Groups ha establert connexió amb la base de dades.');
});

exports.getGrupById = (req, res) => {
  const id_grup = req.params.id_grup;
  const query = "SELECT * FROM grup WHERE id_grup = ?";

  db.query(query, [id_grup], (error, results) => {
    if (error) {
      console.error('Error en obtenir grups:', err);
            res.status(500).send('Error en obtenir grups');
            return;
    }
    if (results.length === 0) {
        res.status(404).send('Cap grup trobat');
    } else {
        res.json(results[0]);
    }
  });
};

//aquesta funció no només torna els grups d'un usuari, sinó que hi afegeix el professor
exports.getGrupsByUserId = (req, res) => {
  const user_id = req.params.user_id;

  const query = `SELECT grup.id_grup, grup.nom, grup.profe_id, grup.descripcio, grup.created_at, grup_usuaris.is_confirmed
                FROM grup_usuaris 
                JOIN grup ON grup.id_grup = grup_usuaris.grup_id 
                WHERE grup_usuaris.usuari_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error en obtenir grups per a usuari:', err);
      res.status(500).send('Error en obtenir grups per a usuari');
      return;
    }

    if (results.length === 0) {
      res.json([]);
      return;
    }

    const grups = results.map((grup) => ({
      id_grup: grup.id_grup,
      nom: grup.nom,
      profe_id: grup.profe_id,
      descripcio: grup.descripcio,
      professor: null,
      created_at: grup.created_at,
      is_confirmed: grup.is_confirmed
    }));

    const profeIds = grups.map((grup) => grup.profe_id);
    const uniqueProfeIds = [...new Set(profeIds)];

    const query = `SELECT user_id, nom FROM usuaris WHERE user_id IN (?)`;

    db.query(query, [uniqueProfeIds], (err, results) => {
      if (err) {
        console.error('Error en obtenir els professors:', err);
        res.status(500).send('Error en obtenir els professors');
        return;
      }

      const professorsById = results.reduce(
        (acc, professor) => ({
          ...acc,
          [professor.user_id]: professor.nom,
        }),
        {}
      );

      const grupsWithProfessors = grups.map((grup) => ({
        ...grup,
        professor: professorsById[grup.profe_id] || null,
      }));

      res.json(grupsWithProfessors);
    });
  });
};


exports.getGrupsByProfeId = (req, res) => {
  const id_profe = req.params.id_profe;
  const query = "SELECT * FROM grup WHERE profe_id = ?";

  db.query(query, [id_profe], (error, results) => {
    if (error) {
      console.error('Error en obtenir els grups:', err);
            res.status(500).send('Error en obtenir els grups');
            return;
    }
    if (results.length === 0) {
      console.error('Cap grup trobat');
      res.json([]);
    } else {
        res.json(results);
    }
  });
};

exports.getUsuarisByGrupId = (req, res) => {
  const id_grup = req.params.id_grup;
  const is_confirmed = req.query.is_confirmed;

  let query = `
    SELECT usuaris.* 
    FROM usuaris 
    JOIN grup_usuaris ON usuaris.user_id = grup_usuaris.usuari_id 
    WHERE grup_usuaris.grup_id = ?
  `;

  if (is_confirmed !== undefined) {
    query += 'AND grup_usuaris.is_confirmed = ?';
  }

  db.query(query, [id_grup, is_confirmed], (err, results) => {
    if (err) {
      console.error('Error en obtenir els usuaris del grup:', err);
      res.status(500).send('Error en obtenir els usuaris del grup');
      return;
    }

    if (results.length === 0) {
      res.json([]);
      return;
    }

    res.json(results);
  });
};




exports.addGrupUsuari = async (req, res) => {
  const { usuari_id, grup_id, is_confirmed } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO grup_usuaris (usuari_id, grup_id, is_confirmed) VALUES (?, ?, ?)',
        [usuari_id, grup_id, is_confirmed],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    if (result.affectedRows === 1) {
      res.json({ message: 'Objecte inserit correctament' });
    } else {
      res.status(500).json({ message: 'Error en inserit objecte' });
    }
  } catch (err) {
    console.error('Error en inserir objecte a la taula grup_usuaris: ', err);
    res.status(500).json({ message: 'Error en inserir objecte' });
  }
};

exports.confirmGrupUsuari = (req, res) => {
    const { usuari_id, grup_id } = req.params;
    const sql = 'UPDATE grup_usuaris SET is_confirmed = 1 WHERE usuari_id = ? AND grup_id = ?';
    db.query(sql, [usuari_id, grup_id], (err, result) => {
        if (err) {
            console.error('Error en actualitzar is_confirmed:', err);
            res.status(500).send('Error en actualitzar is_confirmed');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Objecte no trobat');
        } else {
            res.json({ message: 'Valor de is_confirmed actualitzat correctament', result });
        }
    });
}



exports.deleteGrupUsuari = (req, res) => {
  const grup_id = req.params.grup_id;
  const usuari_id = req.params.usuari_id;

  const query = 'DELETE FROM grup_usuaris WHERE grup_id = ? AND usuari_id = ?';

  db.query(query, [grup_id, usuari_id], (err, result) => {
    if (err) {
      console.error('Error en esborrar objecte:', err);
      res.status(500).send('Error en esborrar objecte');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Objecte no trobat');
    } else {
      res.status(200).send('Objecte esborrat correctament');
    }
  });
};

exports.deleteGrupAndUsers = (req, res) => {
  const grupId = req.params.id_grup;

  // Elimina los objetos relacionados en la tabla "grup_usuaris"
  const deleteQuery = `DELETE FROM grup_usuaris WHERE grup_id = ?`;
  db.query(deleteQuery, grupId, (err, result) => {
    if (err) {
      console.error('Error en eliminar els objectes de la taula "grup_usuaris":', err);
      res.status(500).send('Error en eliminar els objectes de la taula "grup_usuaris"');
      return;
    }

    // Elimina el objeto de la tabla "grups"
    const query = `DELETE FROM grup WHERE id_grup = ?`;
    db.query(query, grupId, (err, result) => {
      if (err) {
        console.error('Error en eliminar objecte de la taula "grup":', err);
        res.status(500).send('Error en eliminar objecte de la taula "grup"');
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send('Objecte no trobat');
      } else {
        res.status(200).send('Objecte eliminat correctament');
      }
    });
  });
};

exports.createGrup = (req, res) => {
  const { nom, profe_id, descripcio } = req.body;
  
  const query = `INSERT INTO grup (nom, profe_id, descripcio) VALUES (?, ?, ?)`;
  db.query(query, [nom, profe_id, descripcio], (err, result) => {
    if (err) {
      console.error('Error en crear el grup:', err);
      res.status(500).send('Error en crear el grup');
      return;
    }
    
    res.json({ id_grup: result.insertId });
  });
};



