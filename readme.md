# About

This repo provides an example showing how to setup a local development environment for building nodejs serverless functions, based on [Kubeless](https://kubeless.io/), to be deployed on [Kyma](https://kyma-project.io/). Deployments are automated using a git action which builds a deployment.yaml which is then deployed to the Kyma cluster.

## Deployment via git action.

After cloning the repo, within github choose `Settings` -> `Secrets` and add the secret `KUBE_CONFIG_DATA` and place a base64 encoded version of your clusters kubeconfig which can be performed by using `https://www.base64encode.org/` or via cli tools. This of course could be automated by relying on the cli tools of your cloud provider.

The parameters for deployment are defined within the `package.json` within the `buildParameters` object.

## Local Development - Kubeless

Local development relies on kubeless runtime which can be found at

`https://github.com/kubeless/runtimes/tree/master/stable/nodejs`

The necessary files are found in the localdev folder. To run locally, first install the kubeless components by running

`npm install`

within the localdev folder. The function can then be called by running

`MOD_NAME=../examplefn FUNC_HANDLER=main node kubeless.js`

Which will make it available at

`http://localhost:8080/`

The file `localdevenv.js` was added to enabled the support of envirnoment variables where as the envirnoment variables used by the function are defined in `.env`.

## Local Development - Service Bindings

Service Bindings that are configured in the kyma ui should be referenced within the localdevenv file and can be made available by using the port-forward feature of kubectl for example

`kubectl port-forward services/d13-commerce-01-3afe958e-6603-45f1-bdbb-789a676b5fa9 8088:80 -n kyma-integration`

The service name can be found in the function defintion as deployed on the cluster by running

`kubectl get function examplefn -n stage -o yaml`

and referring to the `servicebindingusages` values found in the `kubectl.kubernetes.io/last-applied-configuration` property.

Local access to the service would then be acheivable via

`http://3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost:8088`

For correct resolution of the service a DNS entry in your hosts file will need to be added

`127.0.0.1 3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost`
