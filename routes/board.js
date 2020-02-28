const path = require('path');
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const router = express.Router();
const { pager } = require(path.join(__dirname, '../modules/pager'));
const { upload } = require(path.join(__dirname, '../modules/multer'));
const { connect } = require(path.join(__dirname, '../modules/mysql'));
const { unLink, getLink, getURL, PLACE_HOLDER } = require(path.join(__dirname, '../modules/file-util'));

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	let page = Number(req.params.page);
	if(!page) page = 1;
	req.app.locals.page = page;
	let sql = "SELECT count(id) FROM board";
	let result = await connect.execute(sql);
	let pagerVals = pager({ page, total: result[0][0]['count(id)'] });
	sql = "SELECT * FROM board ORDER BY id DESC LIMIT ?, ?";
	let sqlVals = [pagerVals.stRec, pagerVals.list];
	result = await connect.execute(sql, sqlVals);
	for(let v of result[0]) {
		v.wdate = moment(v.wdate).format('YYYY-MM-DD');
	}
	const pugVals = { rs: result[0], pager: pagerVals };
	res.render('board-list.pug', pugVals);
});

router.get(['/write', '/write/:id'], async (req, res, next) => {
	let title = req.params.id ? "글수정" : "글작성";
	let rs = {id: '', title: '', writer: '', savefile: '', content: ''};
	if(req.params.id) {
		let sql = "SELECT * FROM board WHERE id="+req.params.id;
		let result = await connect.execute(sql);
		rs = result[0][0];
	}
	let pugVals = { title, rs }
	res.render('board-write.pug', pugVals);
});

router.get('/view/:id', async (req, res, next) => {
	let sql = "SELECT * FROM board WHERE id="+req.params.id;
	let result = await connect.execute(sql);
	if(result[0][0].savefile) {
		result[0][0].downfile = result[0][0].savefile;
		result[0][0].savefile = getURL(result[0][0].savefile);
	}
	result[0][0].wdate = moment(result[0][0].wdate).format('YYYY-MM-DD HH:mm:ss');
	let pugVals = { title: "상세보기", rs: result[0][0] }
	res.render('board-view.pug', pugVals);
});

router.post('/save', upload.single('file'), async (req, res, next) => {
	let { id = '', title, writer, content, wdate = new Date(), realfile = '', savefile = '' } = req.body;
	let sql = '', sqlVals = [], result = {};
	if(req.file) {
		realfile = req.file.originalname;
		savefile = req.file.filename;
	}
	if(id === '') {
		sql = "INSERT INTO board SET title=?, writer=?, content=?, wdate=?, realfile=?, savefile=?, writer_id=?";
		sqlVals = [title, writer, content, wdate, realfile, savefile, req.session.userid];
	}
	else {
		if(req.file) {
			sql = "SELECT savefile FROM board WHERE id="+id;
			result = await connect.execute(sql);
			if(result[0][0].savefile) unLink(result[0][0].savefile);
			sql = "UPDATE board SET title=?, writer=?, content=?, realfile=?, savefile=? WHERE id=? AND writer_id=?";
			sqlVals = [title, writer, content, realfile, savefile, id, req.session.userid];
		}
		else {
			sql = "UPDATE board SET title=?, writer=?, content=? WHERE id=? AND writer_id=?";
			sqlVals = [title, writer, content, id, req.session.userid];
		}
	}
	result = await connect.execute(sql, sqlVals);
	res.redirect("/board");
});

router.get('/delete/:id', async (req, res, next) => {
	let id = req.params.id;
	let sql, sqlVals, result;
	sql = "SELECT savefile FROM board WHERE id="+id;
	result = await connect.execute(sql);
	if(result[0][0].savefile) unLink(result[0][0].savefile);
	sql = "DELETE FROM board WHERE id=? AND writer_id=?";
	sqlVals = [id, req.session.userid];
	result = await connect.execute(sql, sqlVals);
	res.redirect("/board");
});


router.get('/remove', (req, res, next) => {
	let file = getLink(req.query.file);
	fs.unlink(file, async (err) => {
		let json = {};
		if(err) res.json({code: 500});
		else {
			let sql = 'UPDATE board SET realfile="", savefile="" WHERE id=? AND writer_id=?';
			let sqlVals = [req.query.id, req.session.userid];
			let result = await connect.execute(sql, sqlVals);
			res.json({code: 200});
		}
	});
});

router.get("/download/:file", (req, res, next) => {
	const file = req.params.file;
	const filename = getLink(file);
	res.download(filename);
})


module.exports = router;