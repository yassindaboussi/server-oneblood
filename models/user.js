const mongoose = require('mongoose')

const usershema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required:true,
            unique:true
        },
        password: {
            type: String,
            required: true
        },
        blood: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: false,
        },
        usertype: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        besions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Besion'
    }]
        
    });
mongoose.model("User", usershema)