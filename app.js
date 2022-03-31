const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

require("./models/user");
require("./models/donation");
require("./models/besion");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/donation"));
app.use(require("./routes/besion"));

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on port", PORT);
});
