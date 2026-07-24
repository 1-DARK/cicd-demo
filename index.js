import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.json({ msg: "hi" });
  return res.json({ msg: "Deployed via docker + actions!..." });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT ${PORT}`);
});
