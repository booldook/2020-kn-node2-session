const express = require('express');
const router = express.Router();

router.get(['/', '/list'], (req, res, next) => {
	let values = {
		title: "리스트"
	}
	res.render('board-list.pug', values);
});
router.get(['/write', '/write/:id'], (req, res, next) => {
	let values = {
		title: "글작성"
	}
	res.render('board-write.pug', values);
});
router.get('/view/:id', (req, res, next) => {
	let values = {
		title: "상세보기"
	}
	res.render('board-view.pug', values);
});
router.post('/save', async (req, res, next) => {

});
router.delete('/delete/:id', async (req, res, next) => {

});
router.put('/update/:id', async (req, res, next) => {

});

module.exports = router;