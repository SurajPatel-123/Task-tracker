const express = require('express');
const router = express.Router();
// सही ढंग से डिस्ट्रक्चर करके इम्पोर्ट करना ज़रूरी है
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');

// रूट्स डिफाइन करना
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;