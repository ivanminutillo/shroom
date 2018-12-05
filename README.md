# Shroom 🍄🍄🍄
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Collaborate together in a value network.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

nd. Agent consumes data from 2 possible endpoints, both used in the faircoop ecosystem. If you want to install Agent locally and you're not part of faircoop, [you need to install also the backend locally](https://github.com/FreedomCoop/valuenetwork/blob/master/docs/install.txt)

### Prerequisites

You need `nodejs` and `npm` installed on your machine.

### Run Shroom on your machine locally

Shroom is an ejected version of CRA - Create react app - project.
In order to have a local version of Shroom running on your machine you will need to follow these steps:

```
git clone git@github.com:ivanminutillo/shroom.git
cd shroom
npm install
npm start
```

## Running the tests

The test suite is made with [Puppeeter](https://github.com/GoogleChrome/puppeteer) and [Jest](https://github.com/facebook/jest). Currently the app is covered only with End to End tests. We will cover the app also with unit tests.

To run the tests:

```
npm run debug
```

## Deployment

Agent is a static app, therefore deployment is quite straightforward. You mainly need to build your app.

```
npm run build
```
The resultant artifact contains the static files that will interact with the graphQl layer, you can deploy the folder with github-pages, zeit or any (serverless, or classic) hosting service.

The fair.coop Agent version is deployed with [Zeit](zeti.co) <3


## Built With

* [React](https://github.com/facebook/react) - The web framework used
* [Apollo](https://github.com/apollographql) - Both to manage graphql on the server and as local state management
* [styled-component](https://github.com/styled-components) - Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress 💅
* [webpack](https://github.com/webpack/webpack) - Javascript bundler

## Contributing
[TODO]

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/opencooperativeecosystem/agent/tags). 

## Docs
You can read more about Agent and OCE on our [website](https://opencoopecosystem.net) and [docs](https://docs.opencoopecosystem.net)

## Authors

* **Ivan Minutillo** - [github](https://github.com/ivanminutillo) - [website](https://ivanminutillo.com)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the [AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html) License

## Acknowledgments

* [Mikorizal](http://mikorizal.org/) (Lynn Foster and Bob Haugen) - to have built the NRP software and keep working hard to foster the transition to the next economy, and for being a costant source of inspiration.
* [FairCoop](https://fair.coop) - to experiment with practice together
