import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import listEndpoints from "express-list-endpoints";
import userRoutes from "./routes/userRoutes";
import tripRoutes from "./routes/tripRoutes";


const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

/* --- Routes ---*/

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Travel Planning API",
    endpoints: endpoints,
  });
});


app.use("/users", userRoutes);
app.use("/trips", tripRoutes);


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl)
  .then(() => { 
    console.log("MongoDB Connected");
    // Start the server
    app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  })
  .catch(err => console.error('MongoDB connection error:', err));