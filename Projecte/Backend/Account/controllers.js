const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});


db.connect((err) => {
    if (err) {
        console.error('Error en connectar Account a la base de dades:', err);
        return;
    }
    console.log('Account ha establert connexió amb la base de dades.');
});

//------------

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query('SELECT * FROM usuaris WHERE email = ?', [email], async (error, results) => {

        if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error intern del servidor' });
        }

        if (!results.length) {
        return res.status(400).json({ message: 'Adreça electrònica o contrasenya incorrectes' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
        return res.status(400).json({ message: 'Adreça electrònica o contrasenya incorrectes' });
        }

        const token = jwt.sign({
            user_id: user.user_id, email: user.email, nom: user.nom,
            role: user.role, is_confirmed: user.is_confirmed,
            is_automatic: user.is_automatic, id_last_act: user.id_last_act,
            points: user.points, img: user.img
        }, process.env.JWT_SECRET, {
        expiresIn: '2h',
        });

        res.status(200).json({ token });
    });
    
};
// ...

// ...

exports.signup = async (req, res) => {
  const { email, password, nom, role, is_automatic, img } = req.body;

  try {
    const existingUser = await query('SELECT * FROM usuaris WHERE email = ?', [email]);

    if (existingUser.length) {
      return res.status(400).json({ message: "Aquesta adreça electrònica ja està registrada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query('INSERT INTO usuaris SET ?', {
      email,
      password: hashedPassword,
      nom,
      role,
      is_automatic,
      img,
    });

    // Obté l'usuari acabat de crear
    const [newUser] = await query('SELECT * FROM usuaris WHERE email = ?', [email]);

    // Genera un token JWT amb la info de l'usuari
    const token = jwt.sign({
      user_id: newUser.user_id,
      email: newUser.email,
      nom: newUser.nom,
      role: newUser.role,
      is_automatic: newUser.is_automatic,
      img: newUser.img,
      is_confirmed: newUser.is_confirmed,
      id_last_act: newUser.id_last_act,
      points: newUser.points
    }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error intern del servidor' });
  }
};



//funció perquè funcioni l'anterior
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// ...



//-----------

exports.getUserById = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM usuaris WHERE user_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error en obtenir l'usuari:", err);
            res.status(500).send("Error en obtenir l'usuari:");
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Usuario no trobat');
        } else {
            res.json(results[0]);
        }
    });
};

exports.getUsuariByEmail = (req, res) => {
    
    const email = req.params.email;
    const query = 'SELECT * FROM usuaris WHERE email = ?';
    console.log('Request body:', req.body); 
    const { nom, password, is_automatic, role, img } = req.body;
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en obtenir usuari' });
            return;
        }

        const usuario = results[0];
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Error en obtenir usuari' });
        }
    });
};

exports.addUser = (req, res) => {
    const { nom, email, password, is_automatic, role, img } = req.body;

    const query = `INSERT INTO usuaris (nom, email, password, is_automatic, role, img) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [nom, email, password, is_automatic, role, img], (err, result) => {
        if (err) {
            console.error('Error en afegir usuari:', err);
            res.status(500).send('Error en afegir usuari');
            return;
        }

        res.status(201).json({ user_id: result.insertId });
    });
};

exports.updateEmail = (req, res) => {
    const id = req.params.id;
    const { newEmail } = req.body;

    const query = 'UPDATE usuaris SET email = ? WHERE user_id = ?';

    db.query(query, [newEmail, id], (err, result) => {
        if (err) {
            console.error('Error en actualitzar email:', err);
            res.status(500).send('Error en actualitzar email');
            return;
        }

        res.status(200).send('Email actualizat correctament');
    });
};

exports.updateNom = (req, res) => {
    const id = req.params.id;
    const { newNom } = req.body;

    const query = 'UPDATE usuaris SET nom = ? WHERE user_id = ?';

    db.query(query, [newNom, id], (err, result) => {
        if (err) {
            console.error('Error en actualitzar el nom:', err);
            res.status(500).send('Error en actualitzar el nom');
            return;
        }

        res.status(200).send('Nom actualitzat correctament');
    });
};

exports.updateLastAct = (req, res) => {
    const id = req.params.id;
    const { newLastAct } = req.body;

    const query = 'UPDATE usuaris SET id_last_act = ? WHERE user_id = ?';

    db.query(query, [newLastAct, id], (err, result) => {
        if (err) {
            console.error('Error en actualitzar id_last_act:', err);
            res.status(500).send('Error en actualitzar id_last_act');
            return;
        }

        res.status(200).send('Última activitat actualitzada correctament');
    });
};

exports.updatePassword = async (req, res) => {
    const id = req.params.id;
    const { newPassword } = req.body;

    try {
        // Encriptar la nova contrasenya abans d'encriptar-la
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = 'UPDATE usuaris SET password = ? WHERE user_id = ?';
        
        db.query(query, [hashedPassword, id], (err, result) => {
            if (err) {
                console.error('Error en actualitzar contrasenya:', err);
                res.status(500).send('Error en actualitzar contrasenya');
                return;
            }

            res.status(200).send('Contrasenya actualitzada correctament');
        });
    } catch (error) {
        console.error('Error en actualitzar contrasenya:', error);
        res.status(500).send('Error en actualitzar contrasenya');
    }
};


exports.addRandomUserByName = (req, res) => {
  const { nom } = req.body;

  const getLastUserIdQuery = 'SELECT MAX(user_id) as last_user_id FROM usuaris';

  db.query(getLastUserIdQuery, (err, results) => {
    if (err) {
      console.error('Error en obtenir últim valor de "user_id":', err);
      res.status(500).send('Error en obtenir últim valor de "user_id"');
      return;
    }

    const newUserId = results[0].last_user_id + 1;

    const newEmail = `user${newUserId}@example.com`;

    const newUser = {
      user_id: newUserId,
      nom: nom,
      email: newEmail
    };

    const insertUserQuery = 'INSERT INTO usuaris SET ?';

    db.query(insertUserQuery, newUser, (err, results) => {
      if (err) {
        console.error('Error en inserir nou usuari:', err);
        res.status(500).send('Error en inserir nou usuari');
        return;
      }

      res.json({ user_id: newUserId });
    });
  });
};


