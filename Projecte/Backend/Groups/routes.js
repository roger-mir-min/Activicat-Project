const express = require('express');
const router = express.Router();
const groupsController = require('./controllers');

router.get('/usuaris/:user_id/grups', groupsController.getGrupsByUserId);
router.get('/profe-grups/:id_profe', groupsController.getGrupsByProfeId);
router.get('/grups/:id_grup', groupsController.getGrupById);
//admet param opcional is_confirmed: 
router.get('/grups/usuaris/:id_grup', groupsController.getUsuarisByGrupId);
router.post('/grup-usuaris-add', groupsController.addGrupUsuari);
//només canvia is_confirmed a 1
router.put('/grup-usuaris-confirm/:usuari_id/:grup_id', groupsController.confirmGrupUsuari);
router.delete('/grup-usuaris-delete/:grup_id/:usuari_id', groupsController.deleteGrupUsuari);
router.delete('/grups-delete/:id_grup', groupsController.deleteGrupAndUsers);
//accepta body: "nom", "profe_id" i "descripcio"
router.post('/grup-add', groupsController.createGrup);

module.exports = router;