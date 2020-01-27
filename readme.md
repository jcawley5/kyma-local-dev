##Deployment via git action.

After cloning the repo, within github choose `Settings` -> `Secrets` and add the secret `KUBE_CONFIG_DATA` and place a base64 encoded version of your clusters kubeconfig which can be performed by using `https://www.base64encode.org/` or via cli tools. This of course could be automated by relying on the cli tools of your cloud provider.

The parameters for deployment are defined within the `package.json` within the `buildParameters` object.

##Local Development - Kubeless

Local development relies on kubeless runtime which can be found at

`https://github.com/kubeless/runtimes/tree/master/stable/nodejs`

The necessary files are found in the localdev folder. To run locally, first install the kubeless components by running

`npm install`

within the localdev folder. The function can then be called by running

`MOD_NAME=../examplefn FUNC_HANDLER=main node kubeless.js`

Which will make it available at

`http://localhost:8080/`
