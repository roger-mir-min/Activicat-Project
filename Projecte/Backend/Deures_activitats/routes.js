const express = require('express');
const router = express.Router();
const deures_activitatsController = require('./controllers');

router.post('/add-deures-activitats', deures_activitatsController.addDeuresActivitats);
router.post('/create-deure', deures_activitatsController.createDeureAutoId);
router.get('/usuaris/:user_id/points', deures_activitatsController.getUserPointsById);
//pot ser amb ambit o sense: http://localhost:3000/usuari-punts/1?ambit=ortografia
router.get('/usuari-punts/:user_id', deures_activitatsController.getSumaPuntsByUsuariAndAmbit);
//inclou subtema i ambit; admet paràmetre is_completed opcional; exemple: http://localhost:3000/deures/1?is_completed=1
router.get('/deures-activitats/:user_id', deures_activitatsController.getDeuresActivitatsByUserId);
//admet tres paràmetres que no són opcionals: .../deures_activitats?deure_id=1&activitat_id=2&usuari_id=3
router.put('/update-deures-activitats', deures_activitatsController.updateDeuresActivitats);
//canvia is_checked a 1
router.put('/update-deures-ischecked/:id_deure', deures_activitatsController.updateDeureIsChecked);
//inclou nom profe i grup; igual pro amb deures: http://localhost:3000/deures/1?is_completed=1
router.get('/deures/:user_id', deures_activitatsController.getDeuresByUserId);
//admet com a opcional is_checked: http://localhost:3000/deures/profe/1?is_checked=1
router.get('/deures/profes/:id_profe', deures_activitatsController.getDeuresByProfeId);
//hi afegeix nom_user
router.get('/deures-activitats-by-deure/:id_deure', deures_activitatsController.getDeuresActivitatsByDeureId);
//serveix perquè profe vegi deures_activitats d'usuari que l'afecten; admet obligatoris: 
//http://localhost:3000/deures-activitats-usuari-by-prof?usuari_id=1&profe_id=1
//afegeix propietats nom de grup i deures: es passa com a params opcionals id_user, id_profe i is_completed
router.get('/deures-activitats-usuari-by-prof/', deures_activitatsController.getDeuresActivitatsByUserAndProfe);

router.delete('/deures-delete/:id_deure', deures_activitatsController.deleteDeure);
router.delete('/deur-act-incomplete-delete/:deure_id', deures_activitatsController.deleteDeurActByDeureIdAndIncompleted);





module.exports = router;
