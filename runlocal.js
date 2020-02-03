const path = require("path");
const modKubeless = require.main.filename;
const modName = process.env.MOD_NAME;
const projectEnvVar = path.join(modKubeless, "..", modName, "..", ".env");

require("dotenv").config({ path: projectEnvVar });
require("./localdev/kubeless");

console.log(`Starting server on ${process.env.FUNC_PORT || "8080"}`);

//Service binding example using kubectl port-forward
//example: kubectl port-forward services/d13-commerce-01-3afe958e-6603-45f1-bdbb-789a676b5fa9 8088:80 -n kyma-integration
//services are named in the format <application id>-<service id>
//to call the service externally use only the service id in the format <service id>.localhost
//make sure to add an entry in your host file for the reference of the service 3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost on 127.0.0.1

process.env["GATEWAY_URL"] = "http://3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost:8088";
