console.log('htmlData', window.htmlData)
var localStorage = window.localStorage
var vue = new window.Vue({
  el: '#root',
  data: function () {
    var data = {
      loaded: false,
      listShow: localStorage.listShow !== '',
      currentUrl: localStorage.currentUrl,
      htmls: window.htmlData.items || []
    }
    if (localStorage.htmls) {
      var cache = JSON.parse(localStorage.htmls)
      if (cache.key === window.htmlData.key) {
        data.htmls = cache
      }
    }
    return data
  },
  mounted: function () {
    this.loaded = true
  },
  methods: {
    toggle: function () {
      this.listShow = !this.listShow
      localStorage.listShow = this.listShow ? '1' : ''
    },
    // 向数组添加一条数据即可
    showHtml: function (item) {
      if (item.isLeaf) {
        this.$refs.frameMain && (this.$refs.frameMain.src = localStorage.currentUrl = this.currentUrl = item.url)
      }
      localStorage.htmls = JSON.stringify(this.htmls)
    }
  },
  components: {
    tree: {
      name: 'tree',
      template: `
      <ul class="html-list" >
        <li v-for='item in tree'
          @mouseleave.stop="itemLeave(item,$event)"
          @mouseenter.stop="itemEnter(item,$event)"
          :class="{hover:currentId===item.id,active:item.url===currentUrl,'sub-item':item.level>2}"
          class="html-item"
          @click="_itemClick(item,$event)" >
          <span class="ok" v-if="item.url===currentUrl">√</span>
          {{item.name}}{{item.children&&item.children.length>0&&"("+item.children.length+")"}}
          <tree :item-click="itemClick" :current-url="currentUrl" :tree='item.children' v-if='checkExpand(item) ' ></tree>
        </li>
      </ul>`,
      props: ['tree', 'expand', 'itemClick', 'currentUrl'],
      data() {
        return {
          currentId: null
        }
      },
      methods: {
        itemLeave(item, $event) {
          this.currentId = null
        },
        itemEnter(item, $event) {
          this.currentId = item.id
        },
        checkExpand(item) {
          if (item.level < 3 && !item.expanded) {
            item.expand = true
            item.expanded = true
          }
          return item.expand
        },
        _itemClick: function (item, $event) {
          if (!item.isLeaf) {
            item.expand = !item.expand
          }
          this.itemClick(item, $event)
          $event.cancelBubble = true
        }
      }

    }
  }

})
