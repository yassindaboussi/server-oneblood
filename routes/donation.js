const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requireLogin')
const Donation = mongoose.model("Donation")

router.get('/alldonation', (req, res) => {
	Donation.find()
		.populate("postedBy","email name blood adress")
		.then(donations => {
			res.json({ donations })
		})
		.catch(err => {
			console.log(err)
		})
})
router.post('/donation', requirelogin, (req, res) => {
	const { title, description } = req.body
	if (!title || !description) {
		return res.status(422).json({error:"add all the fields"})
	}
	//console.log(req.user)
	//res.send("ok")
	
	const donation = new Donation({
		title: title,
		description: description,
		postedBy:req.user
	})
	req.user.password = undefined
	donation.save().then(result => {
		res.json({ donation: result })
	})
		.catch(err => {
			console.log(err)
		})

})
router.get('/mydonation', requirelogin, (req, res) => {
	Donation.find({ postedBy: req.user._id })
		.populate("postedBy", "email name blood adress")
		.then(mydonation => {
			res.json({ mydonation })
		})
		.catch(err => {
			console.log(err)
		})

})


module.exports = router