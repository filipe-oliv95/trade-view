const Database = require("better-sqlite3");
const path = require("path");

const dbPath =
	process.env.NODE_ENV === "development"
		? "./daytrade.db"
		: path.join(process.resourcesPath, "./daytrade.db")

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
exports.db = db;