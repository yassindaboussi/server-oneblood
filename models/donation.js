const { request } = require('express')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const donationschema = new mongoose.Schema(
    {
        title: {
            type: String,
            request: true
        },
        description: {
            type: String,
            request: true
        },
        postedBy: {
            type: ObjectId,
            ref: "User"

        }
        


    })
mongoose.model("Donation", donationschema)