//libs
const pathTool = require('path')
const fs = require('fs')
const globby = require('globby')
const jsBeautify = require('js-beautify')
const stringify = require('json-stringify-pretty-compact')
const watch = require('glob-watcher')
//end libs
const watcher = watch('src/**/*.html', function (done) {
  console.log('file changed')
  initJsData()
  done()
})

function initJsData() {
  const templatePath = './src/index.js'
  const ROOT = __dirname
  const resolveSrc = pathTool.resolve.bind(pathTool.resolve, ROOT, 'src')
  const htmls = globby.sync(['html/**/*.html', '!**/_*.html', '!**/_*/**/*'], { cwd: 'src' })

  console.log('\n\n\n\n-------------------------------------------')
  function setChildren(arr = [], item = { children: [] }, parentUrl = '', level = 4, spliter = '/') {
    const itemsSet = new Set()
    const reg = new RegExp('^' + parentUrl + '([^/]+?/){' + (level - 1) + '}([^/]+?(/|\.html))', 'g')
    arr.forEach(url => {
      const result = url.match(reg)
      if (result && result.length > 0) {
        itemsSet.add(result[0])
      }
    })

    const result = Array.from(itemsSet)
    console.log('result', result)
    return result
  }

  setChildren(htmls)


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
