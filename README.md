# 移动端项目脚手架

## TODO

- [x] 支持快速生成 react 模版或者react-hooks 模版；
- [x] eslint，prettier，stylelint 校验规范；
- [x] husky 代码提交校验；
- [x] 自动校验模块文件名，防止文件覆盖；
- [x] deploy 命令自动化部署；
- [x] 自动过滤 node_modules & .vscode 等上传服务器
- [x] 部署离线App
...
- [ ] 基于react + typescript 项目模块开发 
- [ ] 由于公司单元环境 ip 零散 ，暂时先手动输入ip部署吧
## ehapp 脚手架使用说明

1. 全局安装：`npm install ehapp -g`

2. 新创建一个app项目：`ehapp --init`

> app 项目命名规范：单独英文或英文 + `-` 命名方式

3. 业务开发，打包，将文件拖入zapp repo 统一托管

> 建议在 zapp 目录下运行 `ehapp -i` 来获取相同文件名格式校验

4. 自动化部署
> 先运行命令打包，然后执行 `ehapp -d` 部署项目到单元环境，部署完成即可通知测试

## 脚手架常用命令

- [x] `ehapp --version or -V   // ehapp curren version `

- [x] `ehapp --init or -i xx // create an app template ` 

- [x] `ehapp -l or --list // view a list of all available templates `
- [x] `ehapp -h or --help // output usage information of the ehapp`
- [x] `ehapp -d or ehapp --deploy // deploy app to server`

## FAQ

该脚手架仅支持单独部署 zapp 项目，如果部署 ehome-admin 或其它后台项目需要 运用Jenkins
