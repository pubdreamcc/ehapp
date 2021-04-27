const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;
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

const initQus = [
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
    suffix: "(enter 跳过)",
  },
  {
    type: "input",
    name: "author",
    message: "请输入作者名称",
    suffix: "(enter 跳过)",
  },
  {
    type: "list",
    name: "template",
    message: "选择其中一个作为项目模版",
    choices: ["react-hooks (hooks项目模版)", "react (react项目模版)"],
  },
];

const deployQus = [
  {
    type: "confirm",
    message: chalk.green("是否已经打包完成"),
    name: "isBuild",
    suffix: "(enter 确认)",
  },
  {
    type: "list",
    name: "offline",
    message: chalk.green("是否为离线App"),
    choices: ["No", "Yes"],
    when: (answers) => {
      return answers.isBuild;
    },
  },
  {
    type: "input",
    name: "ip",
    message: "请输入单元环境ip地址",
    validate: (val) => {
      const pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
      if (!pattern.test(val)) {
        return console.log(chalk.red("\n👉 ip 地址不合法"));
      }
      return true;
    },
    when: (answers) => {
      return answers.isBuild;
    },
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
  const { projectName, description = "", author = "", template } = answers;
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
        if (template.split(" ")[0].includes("hooks")) {
          packageContent.config.commitizen.path =
            "./" +
            path.join(projectName, packageContent.config.commitizen.path);
        }
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

const getFilesDir = (offline) => {
  const dirArr = [];
  const basename = path.basename(process.cwd());
  let notExitFiles = 0;
  const remoteBaseName = "/data1/ehserver/server/resources/";
  if (offline === "Yes") {
    const humpName = basename.replace(/\-(\w)/g, (all, letter) => {
      return letter.toUpperCase();
    });
    dirArr.push({
      local: process.cwd(),
      remote: `${remoteBaseName}nar/${humpName}`,
    });
  }
  for (const item of ["build", "dist", "b"]) {
    const dir = path.join(process.cwd(), item);
    try {
      const res = fs.statSync(dir);
      if (res.isDirectory()) {
        dirArr.push({
          local: dir,
          remote: `${remoteBaseName}${basename}/${item}`,
        });
        break;
      }
    } catch (error) {
      notExitFiles++;
      continue;
    }
  }
  if (notExitFiles === 3) {
    dirArr.push({
      local: process.cwd(),
      remote: `${remoteBaseName}${basename}`,
    });
  }
  return dirArr;
};

module.exports = {
  templates,
  initQus,
  initTemplateDefault,
  deployQus,
  getFilesDir,
};
