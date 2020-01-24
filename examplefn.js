const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    const Url = "https://httpbin.org/anything";
    console.log("sending test two get to ", Url);
    const { data: result } = await axios.get(Url, {
      params: { header1: process.env.header1 }
    });
    console.log(result);
    return result;
  }
};
