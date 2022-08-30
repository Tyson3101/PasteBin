require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const Keyv = require("@keyv/mongo");
const {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} = require("date-fns");
const PORT = process.env.PORT || 5000;
const dbRouter = require(`${__dirname}/database/routeToDbInfo`);
app.use("/info/bin", dbRouter);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

const keyv = new Keyv(process.env.DB);
keyv.on("error", (err) => console.log("Connection Error", err));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/bin/:BinID", async (req, res) => {
  let fullPath = req.protocol + "://" + req.get("host") + req.originalUrl;
  databaseData = await keyv.get("pastebin");
  console.log(databaseData);
  let BinID = req.params.BinID;
  console.log(BinID);
  if (!databaseData.some((a) => a["binID"] === BinID)) {
    return res.render("notFound");
  }
  let obj = databaseData.find((a) => a["binID"] === BinID);
  let text = obj.text;

  res.render("bin", {
    text: text,
    path: fullPath,
    obj: obj,
    time: time(obj.createdAt, new Date(Date.now())),
  });
});

app.post("/create", async (req, res) => {
  databaseData = await keyv.get("pastebin");
  let id = (await import("nanoid")).nanoid();
  databaseData[0].binsCount += 1;
  const toPush = {
    type: "SaveText",
    binID: id,
    createdAt: Date.now(),
    text: req.body.text,
  };
  databaseData.push(toPush);
  await keyv.set("pastebin", databaseData);
  res.json(toPush);
});

app.get("*", (req, res) => {
  res.render("notFound");
});

function time(pastTime, nowTime) {
  let past = new Date(pastTime);
  let now = new Date(nowTime);
  let years = differenceInYears(now, past);
  let months = differenceInMonths(now, past);
  let weeks = differenceInWeeks(now, past);
  let days = differenceInDays(now, past);
  let hours = differenceInHours(now, past);
  let minutes = differenceInMinutes(now, past);
  if (years >= 1) {
    if (years === 1) return `${years} Year ago`;
    else return `${years} Years ago`;
  } else if (months >= 1) {
    if (months === 1) return `${months} Month ago`;
    else return `${months} Months ago`;
  } else if (weeks >= 1) {
    if (weeks === 1) return `${weeks} Week ago`;
    else return `${weeks} Weeks ago`;
  } else if (days >= 1) {
    if (days === 1) return `${days} Day ago`;
    else return `${days} Days ago`;
  } else if (hours >= 1) {
    if (hours === 1) return `${hours} Hour ago`;
    else return `${hours} Hours ago`;
  } else if (minutes >= 1) {
    if (minutes === 1) return `${minutes} Minute ago`;
    else return `${minutes} Minutes ago`;
  } else {
    return `Just Now`;
  }
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
