const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

const makePath = () => {
	const folder = path.join(__dirname, '../uploads/' + moment(new Date()).format('YYMMDD'));
	if(!fs.existsSync(folder)) fs.mkdirSync(folder);
	return folder;
};

const makeFile = (fileName) => {
	let ext = path.extname(fileName);
	return moment(new Date()).format('YYMMDD') + '-' + Date.now() + '-' + Math.floor(Math.random() * 900 + 100) + ext;
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, makePath());
	},
	filename: (req, file, cb) => {
		cb(null, makeFile(file.originalname))
	}
});

const fileFilter = (req, file, cb) => {
	let allowExt = ['.jpg', '.jpeg', '.gif', '.png', '.zip', '.txt', '.pdf'];
	let ext = path.extname(file.originalname).toLocaleLowerCase();
	if(allowExt.indexOf(ext) > -1) {
		req.fileUploadChk = true;
		cb(null, true);
	}
	else {
		req.fileUploadChk = false;
		cb(null, false);
	}
};

module.exports = { upload: multer({storage, fileFilter}) };
