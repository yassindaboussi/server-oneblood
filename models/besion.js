const { request } = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const besionschema = new mongoose.Schema(
    {
        datepost: {
            type: String,
            request: true
        },
        nom: {
            type: String,
            request: true
        },
        location: {
            type: String,
            Request: true
        },
        blood: {
            type: String,
            Request: true
        },
        phone: {
            type: Number,
            Request:true
        },
        avatar: {
            type: String,
            Request:true
        },
        situation: {
            type: String,
            Request:true
        },
        postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}
    })
mongoose.model("Besion", besionschema)