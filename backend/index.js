require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./models/HoldingsModel");

const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const { userVerification } = require("./Middlewares/AuthMiddleware");

const app = express();

const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

app.use(
  cors({
    origin: ["https://zerodhaclone-2-szyv.onrender.com", "https://zerodhaclone-5.onrender.com"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.post("/", userVerification);

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  try {
    let { name, qty, price, mode } = req.body;
    qty = Number(qty);
    price = Number(price);
    let newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
    });

    await newOrder.save();
    let stock = await HoldingsModel.findOne({ name });
    if (mode === "BUY") {
      if (stock) {
        const totalQty = stock.qty + qty;
        const newAvg = (stock.qty * stock.avg + qty * price) / totalQty;
        stock.qty = totalQty;
        stock.avg = newAvg;
        stock.price = price;

        await stock.save();
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
          price,
          net: "+0%",
          day: "+0%",
        });
      }
    }
    if (mode === "SELL") {
      if (!stock) return res.status(400).send("Stock not in holdings");
      if (qty > stock.qty)
        return res.status(400).send("You can't sell more than you hold");
      stock.qty -= qty;

      if (stock.qty === 0) {
        await HoldingsModel.deleteOne({ name });
      } else {
        await stock.save();
      }
    }
    res.send("Order saved & holdings updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({});
  res.json(allOrders);
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});
