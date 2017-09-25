//libs
const pathTool = require('path')
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
  const watcher = watch('src/**/*.html')

  watcher.on('unlink', fileStateChange)
  watcher.on('add', fileStateChange)
}

function initJsData() {
  const templatePath = './src/index.js'
  const ROOT = __dirname
  const resolveSrc = pathTool.resolve.bind(pathTool.resolve, ROOT, 'src')
  const htmls = globby.sync(['html/**/*.html', '!**/_*.html', '!**/_*/**/*'], { cwd: 'src' })

  console.log(`\n\n\n\n-------------${momentHelper.get()}------------------------------`)
  function setChildren(arr = [], parentUrl = '', level = 1, flatData = {}) {
    const items = []
    const reg = new RegExp('^' + parentUrl + '([^/]+?(\/|\.html)){1}', 'g')
    const dic = {}
    arr.forEach(url => {
      const result = url.match(reg)
      if (result && result.length > 0 && !dic[result[0]]) {
        const itemPath = result[0]
        dic[itemPath] = 1
        const isLeaf = /\.html$/.test(itemPath)
        const item = { name: itemPath, level, isLeaf, children: isLeaf ? undefined : setChildren(arr, itemPath, level + 1, flatData).items }
        flatData[item.name] = flatData[item.name] || []
        flatData[item.name].push(item)
        items.push(item)
      }
    })
    return { items, flatData }
  }
  const { flatData, items } = setChildren(htmls)

  console.log(`\n\n\n\n-------------------------------------------------------------------------`)

  function setParent(strs, pathDic = {}) {
    const keys = []
    strs.forEach(path => {
      const key = path.replace(/\/[^\/]+$/, '')
      if (/\//.test(key)) {
        keys.push(key)
      }
      pathDic[key] = pathDic[key] || []
      if (!pathDic[key].includes(path)) {
        pathDic[key].push(path)
      }
    })
    keys.length > 0 && setParent(keys)
    return pathDic
  }




  const content = fs.readFileSync(templatePath, 'utf-8')
  console.log(`发现${htmls.length}个html文件`)
  //移除掉 = 号之后的内容
  let newContent = content.replace(/\[[\w\W]*].*/igm, '')
  //美化json
  newContent += stringify(htmls, { maxLength: 50 })

  //美化js
  newContent = jsBeautify(newContent + ';', { indent_size: 2 })
  // console.log(`生成 js 结果:\n${newContent}`)
  fs.writeFileSync(templatePath, newContent)
  console.log('src/html/index.js 初始化完成')
}
initJsData()
// watchFile()
