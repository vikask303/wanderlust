const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const { listingSchema } = require("../schema")
const Listing = require("../models/listing")
const flash = require("flash")
const {isLoggedIn} = require("../loginMiddleware")
const listingController = require("../controllers/listings")

const multer = require("multer")
const { storage } = require("../cloudConfig")
const upload = multer({ storage })



// Listing Schema Validate Middleware
const validateListing = (req,res,next) => {
    const {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/")
// List Route
.get(wrapAsync(listingController.index))
// Add Route**
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))

// .post(upload.single("listing[image]"), (req, res) => {
//   console.log(req.file);   // Cloudinary file info
//   console.log(req.body);   // Your other form fields
//   res.send(req.file);      // sends back the uploaded file info
// });

router.route("/:id")
//  Show Route
.get(wrapAsync(listingController.showListing))

// Update Route
.put(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
// Delete Route
.delete(isLoggedIn, wrapAsync(listingController.destroyListing))



// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm))













module.exports = router