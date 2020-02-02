# type-vein
Strictly typed data framework for consuming HTTP services.

Serves a similar purpose as GraphQL, but is actually inspired by the LightSwitch OData implementation which has been discontinued in 2015. Type-Vein is a successor to https://github.com/kukeiko/entity-space. 

Types are defined by specifying their properties and what you can do with them (loadable, creatable, patchable, nullable, optional, ...). With queries you define the tree of entities you want to load (Selection) and how to filter them (Criteria). The actual loading logic has to be implemented by the developer.

# Contributing

Submit a pull request. One can pick one of the issues labeled with the "good first issue" label.  
The repository is commitizen friendly, so commits should follow [this](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) commit guidelines.  
We are using the commitizen family project [cz-emoji](https://github.com/ngryman/cz-emoji), which is a plugin for cz-cli.  
The configuration can be found in the [**package.json**](./package.json) file.

**TL;DR:** Once you feel you are ready to submit your changes just execute this command in your console:  

```bash
npm run commit
```

It will give you a nice prompt and will ask is it a feature/bug/refactoring see below:  
```sh
? Select the type of change you are committing: (Use arrow keys)
❯ feature   🌟  A new feature
  fix       🐞  A bug fix
  docs      📚  Documentation change
  refactor  🎨  A code refactoring change
  chore     🔩  A chore change
```

Then you specify what is a subject of the changes you provide and it generates  
the commit message that is consistent with the commit messages in this repository.

# Status
Very much work in progress. Immediate goal is to query some data with basic filtering, loaded from an http service.

# FAQ

**Q:** I have the following error when I try to 
```bash
$ npm run test
```
No binary for ChromeHeadless browser on your platform.
Please, set "CHROME_BIN" env variable.

**A:** You have to set the CHROME_BIN variable, in linux you can execute this in terminal:
```bash
$ export CHROME_BIN=/usr/local/bin/my-chrome-build
```
More details for running karma with different browsers can be found [here](http://karma-runner.github.io/4.0/config/browsers.html) .
**Note:** puppeteer should fix this issue consistently on all the OSes, so feel free to create an issue in case it didnt work for you out of the box.
##

**Q:** Why is prepublish called npm prepublish?  
**A:** Npm doesnt distinguish between npm install and prepublish. See more details [here](https://github.com/npm/npm/issues/3059)
##

Template:

**Q:**  
**A:**