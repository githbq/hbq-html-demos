//libs
const pathTool = require('path')
const color = require('cli-color')
const fs = require('fs')
const globby = require('globby')
const jsBeautify = require('js-beautify')
const stringify = require('json-stringify-pretty-compact')
const watch = require('glob-watcher')
const momentHelper = require('moment-helper')

//end libs
function fileStateChange(path, stat) {
  console.log('arguments', arguments)
  // console.log('this------->', this)
  console.log('file state changed')
  initJsData()
}
function watchFile() {
  const htmlPattern = 'src/**/*.html'
  const watcher = watch(htmlPattern)
  console.log(color.blue(`watching ${htmlPattern}`))
  watcher.on('unlink', fileStateChange)
  watcher.on('add', fileStateChange)
}
const ROOT = __dirname
const templatePath = './src/data.js'

function initJsData() {

  const htmls = globby.sync(['html/**/*.html', '!**/_*.html', '!**/_*/**/*'], { cwd: 'src' })

  console.log(`\n------------------------${color.bgBlackBright.yellowBright(momentHelper.get())}-------------------`)
  function setChildren(arr = [], parentUrl = '', level = 1, flatData = {}) {
    let items = []
    const reg = new RegExp('^' + parentUrl + '([^/]+?(\/|\.html)){1}', 'g')
    const dic = {}
    arr.forEach(url => {
      const result = url.match(reg)
      if (result && result.length > 0 && !dic[result[0]]) {
        const itemPath = result[0]
        dic[itemPath] = 1
        const isLeaf = /\.html$/.test(itemPath)

        const item = {
          id: Math.random(),
          name: itemPath.replace(/\/$/, '').replace(/\/?.*\//g, ''),
          expand: false,
          expanded: false,
          url: itemPath,
          level, isLeaf,
          children: isLeaf ? undefined : setChildren(arr, itemPath, level + 1, flatData).items
        }
        flatData[item.name] = flatData[item.name] || []
        flatData[item.name].push(item)
        items.push(item)
      }
    })
    items = items.sort(function (a, b) {
      return a.isLeaf ? 1 : 0
    })
    return { items, flatData }
  }
  let { flatData, items } = setChildren(htmls)

  console.log(`发现${htmls.length}个html文件`)
  //移除掉 = 号之后的内容
  let newContent = 'window.htmlData='
  //美化json
  newContent += stringify({ flatData, items, key: Math.random() }, { maxLength: 50 })

  //美化js
  newContent = jsBeautify(newContent + ';', { indent_size: 2 })
  // console.log(`生成 js 结果:\n${newContent}`)
  fs.writeFileSync(templatePath, newContent)
  console.log(color.greenBright(stringify(htmls)))
  console.log('src/html/index.js 初始化完成')
}
initJsData()
if (process.argv.slice(2).indexOf('--watch') >= 0) {
  watchFile()
}

console.log(color.yellowBright(`--------------------------------------------------------------`))
