const express = require('express');
const router = express.Router();
const exercisesController = require('./controllers');

router.get('/activitats', exercisesController.getAllActivitats);
router.get('/activitat/:id', exercisesController.getActivitatById); //crec q no té ús
router.get('/ambit-list/:ambit', exercisesController.getActivitatsByAmbit);
router.get('/tema-list/:tema', exercisesController.getActivitatsByTema);
router.get('/subtema-list/:subtema', exercisesController.getActivitatsBySubtema);
router.get('/max-number/:subtema', exercisesController.getMaxNumberBySubtema);
router.get('/activitat/:subtema/:number', exercisesController.getActivitatBySubtemaAndNumber);

module.exports = router;
