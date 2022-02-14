// components/radio/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectionIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      const {index} = e.currentTarget.dataset
      this.setData({
        selectionIndex: index
      })
      this.triggerEvent('change',{index, label: this.properties.options[index]})
    }
  }
})
