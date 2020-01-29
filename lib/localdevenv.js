const path = require("path");

module.exports = function(fnpath) {
  //load function env variables...
  const envPath = path.join(fnpath, ".env");
  require("dotenv").config({ path: envPath });

  //define any service bindings - access via port-forward
  //example: kubectl port-forward services/d13-commerce-01-3afe958e-6603-45f1-bdbb-789a676b5fa9 8088:80 -n kyma-integration
  //services are named in the format <application id>-<service id>
  //to call the service externally use only the service id in the format <service id>.localhost
  //make sure to add an entry in your host file to reference 3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost on 127.0.0.1

  // process.env["occ-GATEWAY_URL"] = "http://3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost:8088";
};
