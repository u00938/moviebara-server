const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 4000;

const app = express();

const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const usersRouter = require('./routes/users')
const moviesRouter = require('./routes/movies')
const postsRouter = require('./routes/posts')
const scrapsRouter = require('./routes/scraps');


app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/users', usersRouter)
app.use('/movies', moviesRouter)
app.use('/posts', postsRouter)
app.use('/scraps', scrapsRouter)

app.use(logger('dev'));

app.use(cors({
    origin: true,
    methods: 'GET, POST, PATCH, DELETE, OPTIONS',
    credentials: true
}))

app.use(cookieParser());
app.use(bodyparser.json());

app.listen(port, () => console.log("hello"))