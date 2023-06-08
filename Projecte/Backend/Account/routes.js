const express = require('express');
const router = express.Router();
const accountController = require('./controllers');

router.post('/login', accountController.login);
router.post('/signup', accountController.signup);

router.get('/usuaris/:id', accountController.getUserById);
router.get('/usuari-by-email/:email', accountController.getUsuariByEmail);
//body: paràmetres de user
router.post('/add-user', accountController.addUser);
//body: {nom: "nom"}
router.post('/add-random-user', accountController.addRandomUserByName);
//body: {newEmail: "nou email"}
router.put('/usuaris/:id/email', accountController.updateEmail);
//body {newLastAct: "nova act"}
router.put('/usuaris/:id/last_act', accountController.updateLastAct);
//body {newNom: "nou nom"}
router.put('/usuaris/:id/nom', accountController.updateNom);
//body {newImgUrl: "nova url"}
router.put('/usuaris/:id/password', accountController.updatePassword);

module.exports = router;
