const validUrl = require('valid-url');
const catalyst = require('zcatalyst-sdk-node');
const shortId = require('shortid');

const helper = require('../utils/helper');
const constants = require('../utils/constants');

module.exports = (app) => {
	app.get('/item/all', async (req, res) => {
		const capp = catalyst.initialize(req);

		let items = await helper.getValueFromDB.all(capp, []);
		return res.status(200).json(items);
	});

	app.get('/:code', async (req, res) => {
		const capp = catalyst.initialize(req);
		const urlCode = req.params.code;

		let item = await helper.getValueFromCatch(capp, urlCode, null);
		if (item != null) {
			await helper.persistToCache(capp, urlCode, item);
			return res.redirect(item.originalUrl);
		}

		item = await helper.getValueFromDB.code(capp, urlCode, null);
		if (item != null) {
			await helper.persistToCache(capp, urlCode, item);
			return res.redirect(item.originalUrl);
		}

		return res.redirect(constants.errorPage);
	});

	app.post('/item', async (req, res) => {
		const capp = catalyst.initialize(req);
		const { originalUrl } = req.body;

		const urlCode = shortId.generate();
		if (!validUrl.isUri(originalUrl)) {
			return res.status(401).json('invalid original url');
		}
		let item = await helper.getValueFromDB.url(capp, originalUrl, null);
		if (item != null) {
			await helper.persistToCache(capp, item.urlCode, item);
			return res.status(200).json(item);
		}
		item = {
			urlCode,
			originalUrl
		};
		await helper.persistToDB(capp, item);
		return res.status(200).json(item);
	});
};
