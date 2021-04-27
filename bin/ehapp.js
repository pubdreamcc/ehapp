#!/usr/bin/env node

const program = require("commander");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const ora = require("ora");
const package = require("../package.json");
const { NodeSSH } = require("node-ssh");
const {
  templates,
  initQus,
  initTemplateDefault,
  deployQus,
  getFilesDir,
} = require("./utils.js");

const ssh = new NodeSSH();

program
  .version(package.version, null, "output the current version of the ehapp")
  .description("a react app template ")
  .option("-l, --list", "view a list of all available templates")
  .option("-i, --init", "create a new app project")
  .option("-d, --deploy", "deploy app to server")
  .helpOption("-h, --help", "output usage information of the ehapp");

program.parse(process.argv);

const options = program.opts();

if (JSON.stringify(options) === "{}") {
  console.log(
    chalk.red("please use (ehapp -h or --help) to get usage information")
  );
}

if (options && options.list) {
  // 查看可用模版列表
  for (let key in templates) {
    console.log(chalk.yellow(`${key} : ${templates[key].description}`));
  }
}

if (options && options.init) {
  // 初始化项目
  inquirer.prompt(initQus).then((answers) => {
    let url = templates[answers.template.split(" ")[0]].downloadUrl;
    initTemplateDefault(answers, url);
  });
}

if (options && options.deploy) {
  // 部署项目
  inquirer.prompt(deployQus).then(async (answers) => {
    const { ip, offline, isBuild } = answers;
    if (isBuild) {
      const spinner = ora(`${chalk.green("连接服务...")}`).start();
      try {
        await ssh.connect({
          host: ip,
          username: "root",
          password: "123456",
        });
        spinner.text = `${chalk.green("上传文件...")}`;
        const dirArr = getFilesDir(offline);
        const pArr = [];
        dirArr.forEach((item) => {
          const { local, remote } = item;
          pArr.push(
            ssh.putDirectory(local, remote, {
              concurrency: 5,
              validate: (itemPath) => {
                const baseName = path.basename(itemPath);
                return (
                  baseName.substr(0, 1) !== "." && baseName !== "node_modules"
                );
              },
            })
          );
        });
        try {
          await Promise.all(pArr);
          spinner.succeed("🚩🚩🚩---部署成功!---🚩🚩🚩");
          process.exit();
        } catch (error) {
          spinner.fail("文件上传失败");
          console.log(chalk.red(error));
          process.exit(1);
        }
      } catch (error) {
        spinner.fail("服务器连接失败");
        console.log(chalk.red(error));
      }
    }
  });
}
