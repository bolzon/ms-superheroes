
module.exports = app => {

	const authCtrl = {};

	authCtrl.token = async (req, res) => {
		res.json({ status: 'ok' });
	};

	return authCtrl;
};
