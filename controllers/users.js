const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup")
}

module.exports.signup = async (req,res)=>{
    try{
        let {username, email, password} = req.body
        const newUser = new User({email,username})
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser,(e)=>{
            if(e){
                return next(e)
            }
            req.flash("success", `Welcome ${username}`)
            res.redirect("/listings")
        }) 
    }
    catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login")
}

module.exports.login = async (req,res)=>{
    req.flash("success", "Welcome to WanderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((e)=>{
        if(e){
            return next(err)
        }
        req.flash("success","Logged out Successfully! ")
        res.redirect("/listings")
    })
    
}
