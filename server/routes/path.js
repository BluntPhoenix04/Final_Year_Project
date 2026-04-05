const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/path
// @desc    Get all paths
// @access  Private
router.get('/', authMiddleware, pathController.getPaths);

// @route   POST /api/path
// @desc    Create a path
// @access  Private
router.post('/', authMiddleware, pathController.createPath);

// @route   PUT /api/path/:id
// @desc    Update a path
// @access  Private
router.put('/:id', authMiddleware, pathController.updatePath);

// @route   DELETE /api/path/:id
// @desc    Delete a path
// @access  Private
router.delete('/:id', authMiddleware, pathController.deletePath);

module.exports = router;
