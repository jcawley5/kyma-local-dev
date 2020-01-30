# About

This repo provides an example showing how to setup a local development environment for building nodejs serverless functions, based on [Kubeless](https://kubeless.io/), to be deployed on [Kyma](https://kyma-project.io/). Deployments can then be automated using a git action which builds a deployment.yaml that is then deployed to the Kyma cluster.


## Local Development - Kubeless

The project contains the necessary kubeless configuration to run functions locally which is based on

`https://github.com/kubeless/runtimes/tree/master/stable/nodejs`

To run locally, first install the kubeless components by running

`npm install`

within the root folder and then within the lambdas function folder. The function can then be called within the project root by running

`MOD_NAME=../kyma-git-action/lambdas/examplefn/main FUNC_HANDLER=main node runlocal.js`

Which will make it available at

`http://localhost:8080/`

### Envirnoment variables

The file `localdevenv.js` was added to enabled the support of envirnoment variables. Any envirnoment variables used by the function should be defined in `.env` within the function directory. Any local or service bindings should be defined within the `localdevenv.js` itself.

## Building the deployment.yaml locally

To build the deployment.yaml for a single function locally run within the project root

`FUNCTIONDIR=examplefn npm run deploymentYaml`

## Local Development - Service Bindings

Service Bindings that are configured in the kyma ui should be referenced within the `lib/localdevenv.js` file and can be made available by using the port-forward feature of kubectl for example

`kubectl port-forward services/d13-commerce-01-3afe958e-6603-45f1-bdbb-789a676b5fa9 8088:80 -n kyma-integration`

The service name can be found in the function defintion as deployed on the cluster by running

`kubectl get function examplefn -n stage -o yaml`

by referring to the `servicebindingusages` values found in the `kubectl.kubernetes.io/last-applied-configuration` property.

Local access to the service would then be acheivable via

`http://3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost:8088`

For correct resolution of the service a DNS entry in your hosts file will need to be added

`127.0.0.1 3afe958e-6603-45f1-bdbb-789a676b5fa9.localhost`

## Deployment via git action.

After cloning/forking the repo, open the repo within your github account and choose `Settings` -> `Secrets`.  Add the secret `KUBE_CONFIG_DATA` and place a base64 encoded version of your clusters kubeconfig which can be performed by using `https://www.base64encode.org/` or via cli tools. This of course could be automated by relying on the cli tools of your cloud provider.

The parameters for deployment are defined within the `package.json` of the function within the `buildParameters` object. Also important is the `name` and `main` defined in the package.json. This `name` must match the folder name of the function, in this case `examplefn`. The `main` property is used to determine the actually function defintion, in this case `main.js`.
