const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require('path');

// CLI에서 export NODE_ENV='development' 실행하고 작업해주세요
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "./.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "./.env.development") });
} else {
  throw new Error("process.env.NODE_ENV를 설정하지 않았습니다.");
}

const port = process.env.PORT || 4000;

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyparser.json());

app.use(
  cors({
    origin: true,
    methods: "GET, POST, PATCH, DELETE, OPTIONS",
    credentials: true,
  })
);


const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const postsRouter = require("./routes/posts");
const scrapsRouter = require("./routes/scraps");

app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/posts", postsRouter);
app.use("/scraps", scrapsRouter);

app.listen(port, () => console.log("hello"));
