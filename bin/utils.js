const fs = require("fs");
const path = require("path");
const execSync = require('child_process').execSync;
const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");

const templates = {
  "react-hooks": {
    url: "http://10.1.1.217/eh-front-end/ehome-template-hooks",
    downloadUrl: "http://10.1.1.217:eh-front-end/ehome-template-hooks#master",
    description:
      "基于 react-use 封装各类常用react hooks，搭配 webpack 构建一套 react app 项目",
  },
  react: {
    url: "http://10.1.1.217/eh-front-end/ehome-template",
    downloadUrl: "http://10.1.1.217:eh-front-end/ehome-template#master",
    description: "基于react，搭配webpack 构建一套 react app 项目",
  },
};

const checkName = (projectName) => {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, data) => {
      if (err) {
        return reject(err.message);
      }
      if (data.includes(projectName)) {
        return reject(console.log(chalk.red(`\n👉 ${projectName} 已经存在`)));
      }
      resolve(true);
    });
  });
};

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "请输入项目名称",
    validate: async (val) => {
      if (/^([A-z]-?)+[A-z]+$/.test(val)) {
        // 检测文件名是否已存在
        try {
          return await checkName(val);
        } catch (error) {
          return error;
        }
      }
      return console.log(
        chalk.red("\n👉 文件名必须为单独英文单词或英文单词 + `-` 命名方式")
      );
    },
    filter: (val) => {
      return val.toLowerCase();
    },
  },
  {
    type: "input",
    name: "description",
    message: "请输入项目简介",
    suffix: '(enter 跳过)'
  },
  {
    type: "input",
    name: "author",
    message: "请输入作者名称",
    suffix: '(enter 跳过)'
  },
  {
    type: "list",
    name: "template",
    message: "选择其中一个作为项目模版",
    choices: ["react-hooks (hooks项目模版)", "react (react项目模版)"],
  },
];

const downloadTemplate = (gitUrl, projectName) => {
  const spinner = ora(`${chalk.green("download template...")}`).start();

  return new Promise((resolve, reject) => {
    download(
      gitUrl,
      path.resolve(process.cwd(), projectName),
      { clone: true },
      (err) => {
        if (err) {
          spinner.fail();
          return reject(err);
        }
        spinner.succeed();
        resolve();
      }
    );
  });
};

const changeTemplate = async (answers) => {
  const { projectName = "", description = "", author = "" } = answers;
  const command = `cd ${projectName} && rm -rf .git`;
  try {
    execSync(command);
  } catch (error) {
    console.log(
`${chalk.red(error)}\n
delete the .git file fail, you may need to manually delete the.git file\n
${command}`
);
  }
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), projectName, "package.json"),
      "utf8",
      (err, data) => {
        if (err) {
          return reject(err.message);
        }
        let packageContent = JSON.parse(data);
        packageContent.name = projectName;
        packageContent.author = author;
        packageContent.description = description;
        fs.writeFile(
          path.resolve(process.cwd(), projectName, "package.json"),
          JSON.stringify(packageContent, null, 2),
          "utf8",
          (err, data) => {
            if (err) {
              return reject(err.message);
            }
            resolve();
          }
        );
      }
    );
  });
};

const initTemplateDefault = async (answers, gitUrl) => {
  const { projectName } = answers;
  try {
    await downloadTemplate(gitUrl, projectName);
    await changeTemplate(answers);
    console.log(
`${chalk.bold.cyan("ehapp: ")} "A new app project has been created!"\n
🚩🚩🚩--- happy coding ---🚩🚩🚩\n
next：cd ${projectName} && npm/cnpm install && npm start`
);
  } catch (error) {
    console.log(chalk.red(error));
  }
};

module.exports = {
  templates,
  questions,
  initTemplateDefault,
};
