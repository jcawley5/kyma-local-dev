const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    const ordNum = "00002005";
    const ordersUrl = process.env.GATEWAY_URL + "/electronics/orders/" + ordNum;
    console.log("sending example get to ", ordersUrl);
    const response = await axios.get(ordersUrl);
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  }
};
