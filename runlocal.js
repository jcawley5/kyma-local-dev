const path = require("path");

const modKubeless = require.main.filename;
const modName = process.env.MOD_NAME;
const projectDir = path.join(modKubeless, "..", modName, "..", ".env");

require("dotenv").config({ path: projectDir });
require("./localdev/kubeless");
