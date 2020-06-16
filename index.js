var containers = [] // will store container HTMLElement references
var styleElements = [] // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: appendCss(cssString[, options]).'

function appendCss(css, options) {
  options = options || {}

  if (css === undefined) {
    throw new Error(usage)
  }

  var position = options.prepend === true ? 'prepend' : 'append'
  var container = options.container !== undefined ? options.container : document.querySelector('head')
  var containerId = containers.indexOf(container)
  var styleId = options.id || 'styleId'
  var isClear = options.isClear === true

  // clear before fill again
  var dom = document.getElementById(styleId)
  if (dom && isClear) {
    dom.textContent = ''
  }

  // first time we see this container, create the necessary entries
  if (containerId === -1) {
    containerId = containers.push(container) - 1
    styleElements[containerId] = {}
  }

  // try to get the correponding container + position styleElement, create it otherwise
  var styleElement

  if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
    styleElement = styleElements[containerId][position]
  } else {
    styleElement = styleElements[containerId][position] = createStyleElement()

    if (position === 'prepend') {
      container.insertBefore(styleElement, container.childNodes[0])
    } else {
      container.appendChild(styleElement)
    }
  }

  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xfeff) {
    css = css.substr(1, css.length)
  }

  // set id of attribute
  if (styleId) {
    styleElement.setAttribute('id', styleId)
  }

  // actually add the stylesheet
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css
  } else {
    styleElement.textContent += css
  }

  return styleElement
}

function createStyleElement() {
  var styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  return styleElement
}

module.exports = appendCss
module.exports.appendCss = appendCss