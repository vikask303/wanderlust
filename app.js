const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const listingRouter = require("./routes/listing")
const reviewsRouter = require("./routes/review")
const userRouter = require("./routes/user")
const sessions = require("express-session")
const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

require('dotenv').config()


const MONGO_URL = process.env.MONGO_URL

app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))




main()
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(MONGO_URL)
}


// Session Management
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 604800000, //1 week
        maxAge: 604800000,
        httpOnly: true
    }
} 


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


//Root Route
app.get("/",(req,res)=>{
    res.redirect("/listings")
})


// Routes 
app.use("/", userRouter)
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewsRouter)


// All Routes
app.all("/{*any}", (req, res,next) => {
    next(new ExpressError(404,"Page Not Found"))
});


// Custom Error Handling Middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err
    res.status(status).render("error.ejs",{err})
})



app.listen(process.env.PORT,()=>{
    console.log("app is listening to port 8080")
})