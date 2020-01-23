var parameterize = require("json-parameterization");
const fs = require("fs");
const yaml = require("yaml");
const dotenv = require("dotenv");

module.exports = {
  deploymentYaml: function() {
    const deploymentJSON = JSON.parse(fs.readFileSync("deployment.json"));
    const packageJSON = JSON.parse(fs.readFileSync("package.json"));
    const lamdbdCode = fs.readFileSync(packageJSON.main).toString();
    const envVarData = Buffer.from(".env.json");

    const params = {
      function_name: packageJSON.name,
      function_size: "XS",
      environment_variables: dotenv.parse(envVarData),
      function_deps: packageJSON,
      function_code: lamdbdCode,
      function_trigger: packageJSON.function_trigger
    };

    const deploymentYAML = parameterize(deploymentJSON, params);

    fs.writeFileSync(`deployment.yaml`, yaml.stringify(deploymentYAML));
  }
};
