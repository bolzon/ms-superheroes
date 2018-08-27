
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const HttpStatus = require('./lib/helpers/http').status;

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

	// converts queries "page/per_page" to "offset/limit"
	app.use((req, res, next) => {

		// following GitHub standard, pagination will use:
		// * page - for the page you want to go to
		// * per_page - for how many items you'd like to bring

		let page = parseInt(req.query['page']);
		let perPage = parseInt(req.query['per_page']);

		if (!page || isNaN(page) || page < 1)
			page = 1;

		if (!perPage || isNaN(perPage) || perPage < 1)
			perPage = app.config.defaultItemsPerPage;

		if (perPage > 100)
			perPage = 100;

		req.query.offset = (page - 1) * perPage;
		req.query.limit = perPage;

		delete req.query['page'];
		delete req.query['per_page'];

		next();
	});

	// auxiliar functions to return error messages
	app.use((req, res, next) => {

		res.setTotalCount = (count) => {
			res.header('X-Total-Count', count);
			return res;
		};

		res.sendError = (status, message) =>
			res.status(status).json({ message });

		res.sendUnexpectedError = () =>
			res.sendError(HttpStatus.InternalServerError, 'Unexpected error');

		res.sendNotFound = () =>
			res.sendError(HttpStatus.NotFound, 'Entity or resource not found');

		res.ok = res.end;

		next();
	});
};
