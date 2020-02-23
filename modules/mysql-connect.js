const mysql = require('mysql2/promise');
const connect = mysql.createPool({
	host: "localhost",
	post: 3307,
	user: "node",
	password: "000000",
	connectionLimit: 10,
	waitForConnections: true
});

module.exports = {	connect	};