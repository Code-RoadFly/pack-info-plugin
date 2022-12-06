# vue 打包信息打印
加载index.html时，控制台打印打包时间，打包人，打包分支，以及最后一次提交时间，提交人

### 效果图

![Image text](https://github.com/Code-RoadFly/pack-info-plugin/blob/main/example.png)

## 使用
- 安装依赖

```
npm i pack-info-plugin -save-dev
```
- vue.config.js中使用

```
const HtmlPackInfoPlugin = require('pack-info-plugin')

module.exports = {
    configureWebpack {
        plugins: [
            new HtmlPackInfoPlugin()
        ]
    }
}
```
