const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    const ordersUrl = process.env.GATEWAY_URL + "/electronics/orders/" + process.env.ordNumber;
    console.log("sending test get to ", ordersUrl);
    const response = await axios.get(ordersUrl);
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  }
};
