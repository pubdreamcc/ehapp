#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const inquirer = require("inquirer");
const package = require("../package.json");
const { templates, questions, initTemplateDefault } = require("./utils.js");

program
  .version(package.version, null, "output the current version of the ehapp")
  .description("a react app template ")
  .option("-l, --list", "view a list of all available templates")
  .option("-i, --init", "create a new app project")
  .helpOption("-h, --help", "output usage information of the ehapp");

program.parse(process.argv);

if (JSON.stringify(program.opts()) === "{}") {
  console.log(
    chalk.red("please use (ehapp -h or --help) to get usage information")
  );
}

if (program.opts() && program.opts().list) {
  // 查看可用模版列表
  for (let key in templates) {
    console.log(chalk.yellow(`${key} : ${templates[key].description}`));
  }
}

if (program.opts() && program.opts().init) {
  // 初始化项目
  inquirer.prompt(questions).then((answers) => {
    let url = templates[answers.template.split(" ")[0]].downloadUrl;
    initTemplateDefault(answers, url);
  });
}
