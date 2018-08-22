
const router = require('express').Router();

router.get('/', async (req, res) => {
	res.type('text').send(`Server up on port ${req.app.config.port}`).end();
});

module.exports = router;
