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
  return result
}
