# 移动端项目脚手架 ts 版本

基于原来 hooks 脚手架增加了typescript支持，其他用法和功能均没变。

> ehome-template-hooks repo: http://10.1.1.217/eh-front-end/ehome-template-hooks

## ehapp 脚手架使用说明

1. 全局安装：`npm install ehapp -g`

2. 新创建一个app项目：`ehapp init test-app`，默认创建的项目不引入ts，如需引入ts类型校验，可带参数 `- ts` eg: `ehapp init test-app -ts`

> app 项目命名规范：单独英文或英文 + `-` 命名方式

3. 业务开发，打包，将文件拖入zapp repo 统一托管

## 脚手架常用命令(TODO)

- [x] `ehapp --version or -V   // ehapp curren version `

- [x] `ehapp update  // ehapp upgrade latest version`

- [x] `ehapp init xx // create an app template ` 

- [x] `ehapp init xx -ts or ehapp -ts init xx  // create an app template based on typescript `  

- [ ] `ehapp --help or -h // output ehapp command information`

...
