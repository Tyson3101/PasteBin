require("dotenv").config();
const express = require("express");
const router = express.Router();
const Keyv = require("@keyv/mongo");

const keyv = new Keyv(process.env.DB);
keyv.on("error", (err) => console.log("Connection Error", err));

router.get("/currentID", async (req, res) => {
  databaseData = await keyv.get("pastebin");
  res.json({
    ...databaseData[0],
  });
});

module.exports = router;
