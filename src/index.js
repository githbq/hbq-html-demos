console.log('htmlData', window.htmlData)

new Vue({
  el: '#root',
  data: {
    loaded: false,
    listShow: localStorage.listShow !== '',
    currentHtmlUrl: localStorage.currentHtmlUrl,
    htmls: window.htmlData.items || [],
  },
  mounted: function () {
    this.loaded = true
  },
  methods: {
    toggle: function () {
      this.listShow = !this.listShow
      localStorage.listShow = this.listShow ? '1' : ''
    },
    //向数组添加一条数据即可
    showHtml: function (item) {
      if (item.isLeaf) {
        this.$refs.frameMain && (this.$refs.frameMain.src = localStorage.currentHtmlUrl = this.currentHtmlUrl = item.url)
      } else {
        item.expand = true
      }

    }
  }
})
