//const { Telegraf, Markup } = require("telegraf")
//const bot = new Telegraf(/*"5911975320:AAFYiK-gJ1BcUirkEyCebTTQy1VcUqxoEdY"*/ "6197591525:AAGsDMqEPu-l7KzAAYJVciDQO8l1yuoS9hw")
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
let pixels = require("./polotno.json")


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})
//app.get(/.*/, (req, res) => console.log(req.originalUrl))
app.get(/^\/assets(.*)/, (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})
app.get(/^\/index.css/, (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})

app.get(/^\/(.*).js/, (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})

/*app.get(/^\/socket.io\/(.*)/, (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})*/
io.on("connection", (socket) => {

  socket.on("get_pixels", async (bimba) => {
    socket.emit("get_pixels", pixels)
  })
  socket.on("add_pixels", async (pixelsToAdd) => {
    for (let x in pixelsToAdd) {
      if (!pixels[x])
        pixels[x] = {};

      for (let y in pixelsToAdd[x]) {
        pixels[x][y] = pixelsToAdd[x][y];
      }
    }
    fs.writeFileSync(__dirname + "/polotno.json", JSON.stringify(pixels));
    io.sockets.emit("add_pixels", pixelsToAdd)
  })
  socket.on("delete_pixels", (pixelsToBeDeleted) => {
    for (let x in pixelsToBeDeleted) {
      if (!pixels[x])
        continue;

      for (let y in pixelsToBeDeleted[x]) {
        delete pixels[x][y];
      }

      if (Object.keys(pixels[x]).length === 0)
        delete pixels[x];
    }
    fs.writeFileSync(__dirname + "/polotno.json", JSON.stringify(pixels));
    socket.broadcast.emit("delete_pixels", pixelsToBeDeleted);
  });
  socket.on("log", (a) => console.log(a))
})


/*
bot.on("message", async (context) => {
  context.reply("Привет! Принять участие в игре ты сможешь по кнопке ниже!", Markup.inlineKeyboard([
    [Markup.button.webApp("PixelBattle", "https://pixelviatka.onrender.com/")]
  ]))
})

bot.launch()
*/
server.listen(process.env.PORT || 4000, () => {
  console.log(`listening on port ${process.env.PORT || 4000} _<`)
})

console.log("Started _<")