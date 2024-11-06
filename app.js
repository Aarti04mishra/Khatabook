const express=require('express');
const app=express();
const path=require("path")
const cookieParser=require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.use(cookieParser());

const db=require('./config/mongoose-connection')
const indexRouter=require("./routes/index-router")
const hisaabRouter=require("./routes/hisaab-router")
app.use("/",indexRouter);
app.use("/hisaab",hisaabRouter)

app.listen(3000);