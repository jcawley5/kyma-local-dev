const parameterize = require("json-parameterization");
const fs = require("fs");
const yaml = require("yaml");
const dotenv = require("dotenv");
const crypto = require("crypto");
const path = require("path");

module.exports = {
  deploymentYaml: function() {
    const functionDir = path.join("./lambdas", process.env.FUNCTIONDIR);

    const deploymentJSON = JSON.parse(fs.readFileSync("./build/deployment-template.json"));

    const packageStr = fs.readFileSync(path.join(functionDir, "package.json")).toString();
    const packageJSON = JSON.parse(packageStr);
    const lamdbdCode = fs.readFileSync(path.join(functionDir, packageJSON.main)).toString();
    const envVarData = dotenv.parse(fs.readFileSync(path.join(functionDir, ".env")).toString());
    const envVars = Object.entries(envVarData);
    const sha256Str =
      "sha256:" +
      crypto
        .createHash("sha256")
        .update(lamdbdCode)
        .digest("hex");

    var envArr = [];

    for (const [name, value] of envVars) {
      let tempObj = {
        name: name,
        value: value
      };
      envArr.push(tempObj);
    }

    const params = {
      function_name: packageJSON.name,
      function_size: packageJSON.buildParameters.function_size,
      environment_variables: envArr,
      function_deps: packageStr,
      function_code: lamdbdCode,
      function_trigger: packageJSON.buildParameters.function_trigger,
      namespace: packageJSON.buildParameters.namespace,
      checksum: sha256Str
    };

    const horizontalPodAutoscalerJSON = JSON.parse(
      fs
        .readFileSync("./build/horizontalPodAutoscaler_" + packageJSON.buildParameters.function_size + ".json")
        .toString()
    );

    params.horizontalPodAutoscaler = parameterize(horizontalPodAutoscalerJSON, params);

    const deploymentYAML = parameterize(deploymentJSON, params);
    fs.writeFileSync(`./build/deployment.yaml`, yaml.stringify(deploymentYAML));
  }
};
