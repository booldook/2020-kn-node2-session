const fs = require('fs');
const path = require('path');


const unLink = (file) => {
	let fullPath = path.join(__dirname, '../uploads/' + file.substr(0, 6) + '/' + file);
	try {
		if(fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
	}
	catch (err) {
		console.log(err);
	}
}

const getLink = (file) => {
	return path.join(__dirname, '../uploads/' + file.split("-")[0] + "/" + file);
}

const getURL = (file) => {
	return '/uploads/' + file.split("-")[0] + "/" + file;
}

const PLACE_HOLDER = 'https://via.placeholder.com/300?text=no-image';

module.exports = { unLink, getLink, getURL, PLACE_HOLDER }