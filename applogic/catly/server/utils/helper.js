const constants = require('./constants');

exports.getValueFromDB = {
	code: async (capp, urlCode, fallback = undefined) => {
		let item = await capp
			.zcql()
			.executeZCQLQuery(`SELECT * FROM ${constants.table_name} where urlCode='${urlCode}'`)
			.then((rows) => rows[0])
			.catch(() => null);
		if (item == null || item == undefined) {
			return fallback;
		}
		return item[constants.table_name];
	},
	all: async (capp, fallback = undefined) => {
		let items = await capp
			.zcql()
			.executeZCQLQuery(`SELECT * FROM ${constants.table_name}`)
			.catch(() => null);
		if (items == null || items == undefined) {
			return fallback;
		}
		return items.map((item) => item[constants.table_name]);
	},
	url: async (capp, originalUrl, fallback = undefined) => {
		let item = await capp
			.zcql()
			.executeZCQLQuery(
				`SELECT * FROM ${constants.table_name} where originalUrl='${originalUrl}'`
			)
			.then((rows) => rows[0])
			.catch(() => null);
		if (item == null || item == undefined) {
			return fallback;
		}
		return item[constants.table_name];
	}
};

exports.persistToDB = async (capp, item) => {
	return await capp
		.datastore()
		.table(constants.table_name)
		.insertRow(item);
};

exports.persistToCache = async (capp, urlCode, item) => {
	const cSegment = capp.cache().segment(constants.short_url_segment);
	await cSegment.put(urlCode, JSON.stringify(item));
};

exports.getValueFromCatch = async (capp, urlCode, fallback = undefined) => {
	const cSegment = capp.cache().segment(constants.short_url_segment);
	let item = await cSegment.getValue(urlCode).catch(() => null);
	if (item == null || item == undefined) {
		return fallback;
	}
	return JSON.parse(item);
};
