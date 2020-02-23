const path = require('path');
const express = require('express');
const dateTime = require('date-time');
const router = express.Router();
const {upload} = require(path.join(__dirname, '../modules/multer-conn'));
const {connect} = require(path.join(__dirname, '../modules/mysql-connect'))

router.get(['/', '/list'], async (req, res, next) => {
	let sql = "SELECT * FROM board ORDER BY id DESC";
	let result = await connect.execute(sql);
	for(v of result[0]) {
		v.wdate = dateTime({date: v.wdate});
	}
	let values = {
		title: "리스트",
		rs: result[0]
	}
	res.render('board-list.pug', values);
});
router.get(['/write', '/write/:id'], async (req, res, next) => {
	let values = {
		title: "글작성"
	}
	res.render('board-write.pug', values);
});
router.get('/view/:id', async(req, res, next) => {
	let sql = "SELECT * FROM board WHERE id="+req.params.id;
	let result = await connect.execute(sql);
	if(result[0][0].realfile != '') {
		result[0][0].realfile = '/uploads/' + result[0][0].realfile.split("-")[0] + "/" + result[0][0].realfile;
	}
	result[0][0].realfile.wdate = dateTime({date: result[0][0].wdate});
	let values = {
		title: "상세보기",
		rs: result[0][0]
	}
	res.render('board-view.pug', values);
});
router.post('/save', upload.single('file'), async (req, res, next) => {
	let {title, writer, wdate, content, orifile = '', realfile = '', writer_id = ''} = req.body;
	let sql = 'INSERT INTO board SET title=?, writer=?, wdate=?, content=?, orifile=?, realfile=?, writer_id=?';
	if(req.file) {
		orifile = req.file.originalname;
		realfile = req.file.filename;
	}
	console.log(req.file);
	let value = [title, writer, new Date(), content, orifile, realfile, req.session.userid];
	let result = await connect.execute(sql, value);
	res.redirect("/board");
});
router.delete('/delete/:id', async (req, res, next) => {

});
router.put('/update/:id', async (req, res, next) => {

});

module.exports = router;