const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    var test = 0;
    console.log("env variable header1: ", process.env["header1"]);

    const Url = "https://httpbin.org/anything";
    console.log("sending example get to ", Url);
    const { data: result } = await axios.get(Url, {
      params: { header1: process.env.header1 }
    });

    console.log(result);
    return result;
  }
};
