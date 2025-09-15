const Listing = require("../models/listing")

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find()
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
}


module.exports.showListing = async (req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner")
    if(!listing){
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    }else{
        res.render("listings/show.ejs",{listing})
    }
    
}

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.image = {url, filename}
    newListing.owner = req.user._id
    await newListing.save()
    req.flash("success", "Listing Added Successfully!")
    res.redirect("/listings")
    
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params
    let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file != "undefined"){
    let url = req.file.path
    let filename = req.file.filename
    updatedListing.image = {url, filename}
    updatedListing.save()
    }
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("error", "Listing Deleted!")
    res.redirect("/listings")
}


