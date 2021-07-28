const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    console.log("env variable header 1 -- test 1: ", process.env["header1"]);

    const Url = "https://httpbin.org/anything";
    console.log("sending get request to ", Url);
    const { data: result } = await axios.get(Url, {
      params: { header1: process.env.header1 }
    });

    console.log(result);
    return result;
  }
};
