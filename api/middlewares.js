
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');

module.exports = app => {

	app.disable('x-powered-by');
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ limit: '10mb', extended: true }));
	app.use(helmet());

	app.use(cors({
		methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
		allowedHeaders: [ 'Content-Type', 'Authorization' ]
	}));

	app.use(compression());
	app.use(app.auth.initialize());
	app.use((req, res, next) => {
		res.sendError = (status, message) =>
			res.status(status).json({ message });
		next();
	});
};
