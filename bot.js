const axios = require("axios");
const { Bot } = require("grammy");
const dotenv = require('dotenv')
require('dotenv').config()
const bot = new Bot(process.env.Token);
const Url =
  "http://api.weatherstack.com/current?access_key=4d17599e0f4ffeb4b8b10cd181b755fc&query=";
const fetchData = async (cityName) => {
  const result = await axios.get(`${Url + cityName}`);
  return result;
};

bot.command("start", (ctx) =>
  ctx.reply(
    "Salom men turli davlatlardagi ob-havo ma'lumotlarini men orqali bilib olishingiz mumkin!"
  )
);
bot.on("message", async (ctx) => {
  const message = ctx.message;
  const { data } = await fetchData(message.text);
  if (data.success === false) {
    ctx.reply("Ob-havosini bilmooqchi bo'lgan shaharni kiriting: ");
  } else {
    const { current, location } = data;
    const weatherStatus = current.weather_descriptions[0];
    ctx.reply(
      `🌆 Shahar:${location.name}\n-\n 🌡 Temperatura ${
        current.temperature
      }°\n-\n❓ Ob-havo statusi: ${
        (weatherStatus.toLowerCase().includes("clear") === true && "☀️") ||
        (weatherStatus.toLowerCase().includes("sunny") === true && "☀️") ||
        (weatherStatus.toLowerCase().includes("cloud") === true && "☁️") ||
        (weatherStatus.toLowerCase().includes("overcast") === true && "☁️") ||
        (weatherStatus.toLowerCase().includes("rain") === true && "🌧") ||
        (weatherStatus.toLowerCase().includes("snow") === true && "❄️")
      } ${current.weather_descriptions[0]}`
    );
  }
});
console.log("Bot is running...");
bot.start();
