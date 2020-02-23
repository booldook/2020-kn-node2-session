var path = require('path');
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var { connect } = require(path.join(__dirname, '../modules/mysql-connect'));

/* GET users listing. */
router.get(['/', '/login'], (req, res, next) => {
  const values = {
    title: "로그인"
  }
  res.render('login.pug', values);
});

router.get("/join", (req, res, next) => {
  const values = {
    title: "회원가입"
  }
  res.render('join.pug', values);
});

router.post("/save", async (req, res, next) => {
  let {userid, userpw, username, createAt = new Date(), grade = 1} = req.body;
  userpw = crypto.createHash('sha512').update(userpw + process.env.salt).digest('base64');
  let sql = 'INSERT INTO user SET userid=?, userpw=?, username=?, createAt=?, grade=?';
  let value = [userid, userpw, username, createAt, grade];
  try {
    let result = await connect.execute(sql, value);
    res.redirect("/user");
  }
  catch(err) {
    next(err);
  }
});

router.post("/loginModule", async (req, res, next) => {
  let {userid, userpw} = req.body;
  userpw = crypto.createHash('sha512').update(userpw + process.env.salt).digest('base64');
  let sql = 'SELECT * FROM user WHERE userid=? AND userpw=?';
  let value = [userid, userpw];
  let result = await connect.execute(sql, value);
  res.json(result[0]);
});

module.exports = router;
