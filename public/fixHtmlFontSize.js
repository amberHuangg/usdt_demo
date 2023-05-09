/**
 * 适配pc端及mobile端rem响应式方案，
 * 1.mobile中rem值随设备宽度调整，在标准750尺寸中rem为100，全局默认fontSize为0.14rem（14px）
 * 2.pc中固定rem值位100，全局默认fontSize为0.14rem(14px)，需在global.css中添加body {font-size: .14rem;}
 * 备注：需配合postcss插件`postcss-pxtorem`使用，rootValue设置为100
 * 其他：参考amfe-flexible
 */
;(function flexible(window, document) {
  var DEFAULT_HTML_FONT_SIZE = 100 // 设置htmlFontSize为100px，方便style中自行算换，css中px由插件处理
  var DESIGN_WIDTH = 375 // 设计稿尺寸
  var docEl = document.documentElement

  window.addEventListener('resize', onResize)
  window.addEventListener('pageshow', onPageShow)

  onResize()

  function onPageShow(e) {
    if (e.persisted && isMobile()) {
      setMobileRemUnit()
    }
  }

  function onResize() {
    if (isMobile()) {
      setMobileRemUnit()
    } else {
      // 目前为局部适配pc端，这里默认展示移动端样式，设置为50px
      docEl.style.fontSize = '100px'
      if (location.pathname.indexOf('/pvp/admin') < 0) { // pvp审核页面不限制最大宽度
        docEl.style.maxWidth = 3.75 * parseFloat(document.documentElement.style.fontSize) + 'px'
      }
    }
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    )
  }

  function setMobileRemUnit() {
    var width = document.documentElement.clientWidth || document.body.clientWidth
    var height = document.documentElement.clientHeight || document.body.clientHeight
    var rate = height / width
    if (rate < 1) {
      // 横屏
      width = rate < 0.75 ? width / 2 : width
    }
    var size = (width / DESIGN_WIDTH) * DEFAULT_HTML_FONT_SIZE
    window.rem2px = size
    docEl.style.fontSize = size + 'px'
  }
})(window, document)
