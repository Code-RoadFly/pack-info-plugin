const child_process = require("child_process");
const { chdir } = require("process");

/** 自定义插件，插入打包日期版本号 */
class HtmlWebpackCommonLibsPlugin {
	constructor() {
		// 外部传入配置
		
	}

	apply(compiler) {
	    // 插件名
		const pluginName = 'HtmlWebpackCommonLibsPlugin';

		if (compiler.hooks) {
			
			// webpack 4 support
			compiler.hooks.compilation.tap(pluginName, (compilation) => {

				// 开始生成html以前勾子
				compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
					pluginName,
					(htmlPluginData, callback) => {
						callback(null, htmlPluginData);
					}
				);

				// 在html开始处理以前勾子
				compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
					pluginName,
					(htmlPluginData, callback) => {
						callback(null, htmlPluginData);
					}
				);

				// 添加资源处理HTML勾子
				compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
					pluginName,
					(htmlPluginData, callback) => {
						callback(null, htmlPluginData);
					}
				);
				
				// HTML处理完毕勾子
				compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
					pluginName,
					(htmlPluginData, callback) => {
						// 生成格式化后时间截
						const injectStr = this.getInjectContent();
						htmlPluginData.html = htmlPluginData.html.replace('</html>', injectStr);
						callback(null, htmlPluginData)
					}
				);
				
				// 勾子任务处理完毕发送事件时
				compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
					pluginName,
					(htmlPluginData, callback) => {
						callback(null, htmlPluginData);
					}
				);
			});
		}
	}

	/** 格式化时间 */
	formatDate(date) {
        function pad(value) {
            return (value < 10 ? '0' : '') + value
        }
        let year = date.getFullYear();
        let month = pad(date.getMonth() + 1);
        let day = pad(date.getDate());
        let hour = pad(date.getHours());
        let minutes = pad(date.getMinutes());
        let seconds = pad(date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ":" + minutes + ":" + seconds
    }

	/** 生成打印内容 */
	getInjectContent() {
        const buildDate = this.formatDate(new Date())
		const buildUser = child_process.execSync('git config user.name').toString().trim()
        const branch = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
        const commitUserName = child_process.execSync('git show -s --format=%cn').toString().trim()
        const commitDate = this.formatDate(new Date(child_process.execSync('git show -s --format=%cd').toString()))
        
		const injectStr = '<script type="text/javascript">'+
                          `console.log("%c构建信息：","color: #ffb100");`+
                          `console.log("构建时间：${buildDate}");`+
                          `console.log("构建人：${buildUser}");`+
                          `console.log("构建分支：${branch}");`+
                          `console.log("%c提交信息：","color: green");`+
                          `console.log("提交时间：${commitDate}");`+
                          `console.log("提交人：${commitUserName}");`+
                          '</script></html>';

		return injectStr;
	}
}
  
module.exports = HtmlWebpackCommonLibsPlugin;