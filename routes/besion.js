const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requireLogin')
const Besion = mongoose.model("Besion")
const User = mongoose.model("User")


router.get('/GetAllBesoin', function(req, res, next) {// SHOW All  POSTS
  Besion.find({$or: [{situation: "Normal"},{situation: "Danger"}]}).sort({_id:-1}).exec(function(err, data) {
    if(err) res.status(500).send(err);
    else res.send(data);
  })
});

router.get('/GetAllMyPost', (req, res) => { // SHOW ONLY MY POSTS
    Besion.find({ postedby : req.headers.postedby })
        .exec(function(err, data) {
    if(err) res.status(500).send(err);
    else res.send(data);
  })
      //  console.log(req.headers)
});

router.get('/ShowSituation', (req, res) => { //Danger / Normal
    Besion.find({ situation : req.headers.situation })
        .exec(function(err, data) {
    if(err) res.status(500).send(err);
    else res.send(data);
  })
});

router.post('/CloseCase', (req, res) => {
    let CloseCase = {
        id: req.body._id,
        situation:req.body.situation
    }
    //console.log(CloseCase)
    Besion.findByIdAndUpdate(req.body._id,{$set: CloseCase})
    .then(() => {
        res.json({message: "This Case is Closed"})
    })
    .catch(error => {
        res.json({
            message: "an error occured when updating Post Needy"
        })
    })
})

router.post('/Addbesion', (req, res) => {
    const { datepost, nom,avatar, location, blood, phone,situation,postedby} = req.body
/*  if (!datepost || !nom || !location || !blood || !phone) {
        console.log(req.body)
        return res.status(422).json({ error: "add all the fields" })
    } */
    
    //res.send("ok")

//  const u = User.findOne({ _id: req.user });
    //console.log(u)

    const besion = new Besion({
        datepost: datepost,
        nom: nom,
        avatar:avatar,
        location: location,
        blood: blood,
        phone:phone,
        situation:situation,
        postedby: postedby
    })

    besion.save().then(response => {res.json(besion)})
})


router.post('/UpdatePost', (req, res) => {
    let updatedNeedy = {
        id: req.body._id,
        nom: req.body.nom,
        location: req.body.location,
        blood: req.body.blood,
        phone: req.body.phone,
        situation:req.body.situation
    }
    console.log(updatedNeedy)
    Besion.findByIdAndUpdate(req.body._id,{$set: updatedNeedy})
    .then(() => {
        res.json({message: "The Post updated successfully"})
    })
    .catch(error => {
        res.json({
            message: "an error occured when updating Post Needy"
        })
    })
})


router.delete('/deletPost', function (req, res) {
  var id = req.body._id;
  Besion.findOneAndRemove({ _id: id }, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();

  });
});




router.post('/UpdateAvatarPost', (req, res) => {
   Besion.updateMany({ postedby: req.body.postedby },{ $set: { avatar: req.body.avatar }}).exec(function(err, data) {
    if(err)
    {
        res.status(500).send(err);
        console.log(req.headers)
    } 
    else res.send(data);
  })
})



/*
router.get('/GetAllBesoinn', function(req, res, next) {// SHOW All  POSTS
    Besion.find({$or: [{situation: "Normal"},{situation: "Danger"}]}).sort({_id:-1})
    .select({'__v':0})
    .populate("postedby",{'_id':0,'datepost':0,'nom':0,'location':0,'blood':0,'phone':0,'situation':0,'__v':0,'email':0,'password':0,'age':0,'weight':0,'adress':0,'usertype':0,'besions':0})
    .then(data  => {
        const dataa = data
        res.json(dataa);
    })
    .catch(error  =>{
        console.log(error);
        res.json({
            message: "an error occured when displaying"
        })
    })   
})
*/

module.exports = router