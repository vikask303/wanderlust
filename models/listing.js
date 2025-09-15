const mongoose = require("mongoose")
const Review = require("./review")
const Schema = mongoose.Schema
const { ref } = require("joi")

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image: {
      filename: String,
      url: String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref : "User"
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id: {$in: listing.reviews}})
        .then((res)=>{
            console.log(res)
        })
    }
})


const Listing = mongoose.model("Listing",listingSchema)

module.exports = Listing