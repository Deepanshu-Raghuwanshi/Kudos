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

const allowedOrigins = [
  "https://kudos-alpha-one.vercel.app",
  "https://kudos-kwm1xg5r4-dipanshus-projects-e422a5eb.vercel.app", // Add your other frontend domain here
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming Origin: ", origin); // Log incoming origin for debugging
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Allow credentials if needed (like cookies)
  })
);
app.options("*", cors()); // Handle preflight requests for all routes

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
