const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(1111);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", route);

const DBPass = process.env.PASSWORD;
const PORT = process.env.PORT || 3001;
const mongoUri = `mongodb+srv://dipanshuraghuwanshi:${DBPass}@cluster0.luqz6xt.mongodb.net/kudos?retryWrites=true&w=majority`;

const databaseConnect = () => {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
databaseConnect()
  .then((data) => {
    console.log("Server started with mongodb atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

app.post("/api/users", (req, res) => {
  res.status(200).json({ message: "Success", data: req.body });
});

app.get("/", (req, res) => {
  res.send("Hello, World !");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});