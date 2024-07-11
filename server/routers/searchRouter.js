const requireUser = require('../middlewares/requireUser');
const { searchUsers } = require('../controllers/searchController');
const router = require('express').Router();

// router.get('/user', requireUser, SearchController.searchUsers);
router.get('/user', requireUser, searchUsers);


module.exports = router;