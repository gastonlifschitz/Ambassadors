# Ambassadors WebApp

This is the source code for the IBM Argentina Ambassadors web application.

Productive: [http://ambassadors.mybluemix.net/](http://ambassadors.mybluemix.net/)

Test: [http://ambassadors-test.mybluemix.net/](http://ambassadors-test.mybluemix.net/)

**Important: Keep in mind the productive environment (branch master) and the test environment (branch test) for deployments when you are working on the project.**

## Starting 馃殌

_These instructions will allow you to obtain a copy of the running project on your local machine for development and testing purposes._

路 Install Homebrew `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

路 Install IBM Cloud CLI `curl -fsSL https://clis.cloud.ibm.com/install/osx | sh`

路 Clone this repo `git clone git@github.ibm.com:InnovationAndGrowth/Ambassadors.git`

See **Deployment** to learn how to deploy the project.

### Pre requirements 馃搵

_Use your terminal for the following steps:_

路 Install Node.js: Run `brew install node`. Check the Node and NPM version with `node -v` and `npm -v`.

路 Install MongoDB: Run `brew install mongodb`. Create the 鈥渄b鈥? directory (this is where the Mongo data files will live): `mkdir -p /data/db`.

路 Run `npm i` or `npm install` to install any packages that it depends on.

### Development 馃敡

_What you must run to have a development environment running. The scripts may be shown at any time with the `npm run` command._

路 Run MongoDB locally: `mongod`

路 Run `npm run dev`. Starts the Node server at port 3000 and React App at port 3100 with hot reload.

## Deployment 馃摝

**Important: Keep in mind the productive environment (branch master) and the test environment (branch test) for deployments when you are working on the project.**

_Common steps for both environments_

路 Run `npm run build` to build the project creating a build directory.

路 Log in to IBM Cloud with your IBMid `ibmcloud login --sso`

路 To interactively identify the org and space: `ibmcloud target --cf`

### Productive environment

路 When you log in you must choose the account: **Francisco Nicol谩s Pepe's Account (0b2ad0749d974a2bea5dce43c67c4604) <-> 1585113**

路 Deploy to Cloud Foundry: `ibmcloud cf push`

### Test environment

路 When you log in you must choose the account: **Innovation Team (15e2749cb90945499b8b4fa94454a2e0) <-> 1975986**

路 Deploy to Cloud Foundry: `ibmcloud cf push -f manifest-test.yml`

## Built with 馃洜锔?

- [Node.js](https://nodejs.org/) - An open source, cross-platform runtime environment
- [MongoDB](https://www.mongodb.com/) - NoSQL, document-oriented and open source database system
- [React](https://es.reactjs.org/) - A JavaScript library to build user interfaces
- [Sass](https://sass-lang.com/) - CSS with superpowers. Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

## Authors 鉁掞笍

_All those who helped lift the project from its beginnings._

- **Tomas Cerda** - _Fullstack developer_
- **Luciano Bianchi** - _Fullstack developer_
- **Julieta Ayelen Romero** - _Frontend developer & UX Designer_
- **Maria Cecilia Bel** - _Architect_
- **Antonella Belen Ovando** - _Fullstack developer_
- **Oriana Leira** - _Fullstack developer_
- **Maria Belen Currao** - _UX Designer_

You can also look at the list of all [contributors](https://github.ibm.com/InnovationAndGrowth/Ambassadors/graphs/contributors) who have participated in this project.

## Others 馃巵

- This is a volunteer project that we try to improve day by day 馃.
- Tell others about this project 馃摙
