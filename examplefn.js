const axios = require("axios");

module.exports = {
  main: async function(event, context) {
    // console.log("env variable header1: ", process.env["header1"]);

    // const Url = "https://httpbin.org/anything";
    // console.log("sending test get to ", Url);
    // const { data: result } = await axios.get(Url, {
    //   params: { header1: process.env.header1 }
    // });

    // console.log(result);
    // return result;

    console.log(process.env["header1"]);
    console.log(process.env["occ-GATEWAY_URL"]);
    const code = "00002005";
    const ordersUrl = `${process.env["occ-GATEWAY_URL"]}/electronics/orders/${code}`;
    console.log("orderUrl: %s", ordersUrl);
    const response = await axios.get(ordersUrl, {});
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  }
};
