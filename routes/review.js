const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const Review = require("../models/review")
const Listing = require("../models/listing")
const { reviewSchema } = require("../schema")
const { isLoggedIn } = require("../loginMiddleware")
const reviewController = require("../controllers/reviews")

// Review Schema Validation Middleware

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}



// Reviews Routes

//Add Reviews Route
router.post("/",isLoggedIn, validateReview, reviewController.createReview)

// Delete Route
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview))


module.exports = router