const router = require('express').Router();

// Import API routes 
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).send('<h1> Whoops! 404 Error!</h1>');
});

module.exports = router;