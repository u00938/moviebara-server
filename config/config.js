const dotenv = require("dotenv");
const path = require("path");

// CLI에서 export NODE_ENV='development' 실행하고 작업해주세요
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "../.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "../.env.development") });
} else {
  throw new Error("process.env.NODE_ENV를 설정하지 않았습니다.");
}

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: "moviebara",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
    host: process.env.HOST,
    dialect: "mysql",
  },
};
