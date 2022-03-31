const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const requireLogin = require("../middleware/requireLogin");

const jwt = require("jsonwebtoken");

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user ");
});

router.get("/", (req, res) => {
  res.send("hello ");
});

router.get("/profil", requireLogin, (req, res) => {
  User.findOne(req.user)
    .then((User) => {
      res.json({ User });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    blood,
    age,
    weight,
    adress,
    phone,
    usertype,
    avatar,
  } = req.body;
  if (!name || !email || !password || !blood || !age || !weight || !adress) {
    res.json({ error: "please add all the feilds" });
  }

  const user = await User.findOne({ email: email });
  if (user) {
    res.json({ error: "User Exist " });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hasedPassword,
      blood,
      age,
      weight,
      adress,
      phone,
      usertype: "Donor",
      avatar: name,
    });
    user
      .save()
      .then((user) => {
        res.json({ message: "successfuly post" });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please provide email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const accessToken = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          res.status(200).send(
            JSON.stringify({
              //200 OK
              id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
              blood: savedUser.blood,
              age: savedUser.age,
              weight: savedUser.weight,
              adress: savedUser.adress,
              phone: savedUser.phone,
              usertype: savedUser.usertype,
              avatar: savedUser.avatar,
              token: accessToken,
            })
          );
        } else {
          return res.status(422).json({ error: "invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/UpdateUser", (req, res) => {
  let updatedUser = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    blood: req.body.blood,
    weight: req.body.weight,
    adress: req.body.adress,
    usertype: req.body.usertype,
    avatar: req.body.avatar,
  };
  User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
    .then(() => {
      res.json({ message: "user updated successfully" });
    })
    .catch((error) => {
      res.json({
        message: "an error occured when updating user",
      });
    });
});

router.post("/UpdatePassword", (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    console.log(req.body);
    if (err) {
      console.log("erreur password hash");
      res.json({
        error: err,
      });
    }

    let updatedUser = {
      id: req.body.id,
      password: hashedPass,
    };

    User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
      .then(() => {
        res.json({ message: "Password user updated successfully" });
      })
      .catch((error) => {
        res.json({
          message: "an error occured when updating Password user",
        });
      });
  });
});

router.post("/UpdateAvatar", (req, res) => {
  let updatedUser = {
    id: req.body.id,
    avatar: req.body.avatar,
  };
  User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
    .then(() => {
      res.json({ message: "avatar user updated successfully" });
    })
    .catch((error) => {
      res.json({
        message: "an error occured when updating avatar user",
      });
    });
});

module.exports = router;
