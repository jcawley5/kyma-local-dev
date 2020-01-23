var parameterize = require("json-parameterization");
const fs = require("fs");
const yaml = require("yaml");
const dotenv = require("dotenv");

module.exports = {
  deploymentYaml: function() {
    const deploymentJSON = JSON.parse(
      fs.readFileSync("deployment-template.json")
    );
    const packageStr = fs.readFileSync("package.json").toString();
    const packageJSON = JSON.parse(packageStr);
    const lamdbdCode = fs.readFileSync(packageJSON.main).toString();
    const envVarData = dotenv.parse(fs.readFileSync(".env").toString());
    const envVars = Object.entries(envVarData);
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
      namespace: packageJSON.buildParameters.namespace
    };

    const horizontalPodAutoscalerJSON = JSON.parse(
      fs
        .readFileSync(
          "horizontalPodAutoscaler_" +
            packageJSON.buildParameters.function_size +
            ".json"
        )
        .toString()
    );

    params.horizontalPodAutoscaler = parameterize(
      horizontalPodAutoscalerJSON,
      params
    );

    const deploymentYAML = parameterize(deploymentJSON, params);
    fs.writeFileSync(`deployment.yaml`, yaml.stringify(deploymentYAML));
  }
};
