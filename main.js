const folders = document.querySelectorAll('.folder')
const desktop = document.getElementById('desktop')
desktop.setAttribute('data-context', 'desktop')
const desktopContextMenu = [['Упорядочить значки', 'Обновить'], ['Вставить', 'Вставить ярлык'], ['Создать'], ['Свойства']]
let selectedItem, highlight
let cursordownX, cursordownY, highlightPointX, highlightPointY
let screenOffsetX, screenOffsetY



const clickFoldersHandler = event => {
  if (document.querySelector('.highlighted')) {
    document.querySelector('.highlighted').classList.remove('highlighted')
  }
  event.target.closest('.folder').classList.add('highlighted')


}
const dblclickFoldersHandler = event => {
  event.target.closest('.folder').classList.toggle('opened')

}
const mouseUpHandler = event => {
  console.log(event.target)
  desktop.removeEventListener('mousemove', mouseMoveHandler)
}
const moveAt = (offsetX, offsetY) => {

  selectedItem.style.left = offsetX - cursordownX + 'px'
  selectedItem.style.top = offsetY - cursordownY + 'px'


}
const mouseMoveHandler = (event) => {
  moveAt(event.offsetX, event.offsetY)

}
const mousedownHandler = event => {
  selectedItem = event.target.closest('.folder')
  selectedItem.ondragstart = () => false
  cursordownX = event.offsetX - selectedItem.offsetLeft
  cursordownY = event.offsetY - selectedItem.offsetTop
  console.dir(selectedItem)

  event.target.addEventListener('mouseup', mouseUpHandler)
  desktop.addEventListener('mousemove', mouseMoveHandler)
  clickFoldersHandler(event)
}
const highlightHandler = event => {
  if (event.target.id === 'desktop') {

    highlight = document.createElement('div')
    highlight.classList.add('highlight')
    desktop.append(highlight)

    console.log(event)
    highlightPointX = event.offsetX
    highlightPointY = event.offsetY
    screenOffsetX = event.pageX - event.offsetX
    screenOffsetY = event.pageY - event.offsetY

    highlight.style.left = highlightPointX
    highlight.style.top = highlightPointY

    console.log('x point ', highlightPointX)
    console.log('y point ', highlightPointY)
    //console.dir(screenOffset)

    desktop.addEventListener('mousemove', highlightMoveHandler)
    //desktop.addEventListener('mouseup', highlightDelete)
  }
}

const highlightMoveHandler = event => {

    console.dir(event)
    if (event.target.id === 'desktop') {
      highlight.style.width = Math.abs((event.pageX - screenOffsetX) - highlightPointX) + 'px'
      highlight.style.height = Math.abs((event.pageY - screenOffsetX) - highlightPointY) + 'px'

      // hide highlight line
      /*if (event.offsetX === highlightPointX || event.offsetY === highlightPointY) {
        highlight.style.borderColor = 'rgba(0,0,0,0)'
      } else {
        highlight.style.borderColor = '#333'
      }*/
      // fix highlight point depending the side
      if ((event.pageX - screenOffsetX) < highlightPointX && (event.pageY - screenOffsetY) < highlightPointY) {
        highlight.style.left = (event.pageX - screenOffsetX) + 'px'
        highlight.style.right = highlightPointX + 'px'
        highlight.style.top = (event.pageY - screenOffsetY) + 'px'
        highlight.style.bottom = highlightPointY + 'px'
      }
      /*

              } else if ((event.pageX - screenOffsetX) < highlightPointX && (event.pageY - screenOffsetY) > highlightPointY) {
                highlight.style.left = (event.pageX - screenOffsetX) + 'px'
                highlight.style.right = highlightPointX + 'px'
                highlight.style.top = highlightPointY + 'px'
                highlight.style.bottom = (event.pageY - screenOffsetY) + 'px'
              } else if ((event.pageX - screenOffsetX) > highlightPointX && (event.pageY - screenOffsetY) < highlightPointY) {
                highlight.style.left = highlightPointX + 'px'
                highlight.style.right = (event.pageX - screenOffsetX) + 'px'
                highlight.style.top = (event.pageY - screenOffsetY) + 'px'
                highlight.style.bottom = highlightPointY + 'px'
              } else if ((event.pageX - screenOffsetX) > highlightPointX && (event.pageY - screenOffsetY) > highlightPointY) {
                highlight.style.left = highlightPointX + 'px'
                highlight.style.right = (event.pageX - screenOffsetX) + 'px'
                highlight.style.top = highlightPointY + 'px'
                highlight.style.bottom = (event.pageY - screenOffsetY) + 'px'
              }
      */

    }

}

const highlightDelete = event => {
  //desktop.querySelector('.highlight').remove()
  //desktop.removeEventListener('mouseup', highlightDelete)
}
const clickWindowHandler = event => {
  if (event.target.id === 'desktop') {
    document.querySelectorAll('.highlight').forEach(highlight => highlight.remove())
    document.querySelectorAll('.highlighted').forEach(element => element.classList.remove('highlighted'))
    deleteContextMenu()
  }
}
const contextMenuHandler = event => {
  event.preventDefault()
  deleteContextMenu()
  renderContextMenu(event)


}

const renderContextMenu = (event) => {

  console.dir(event)
  const element = event.target.closest(`[data-context='${event.target.dataset.context}']`)
  if (element) {
    const contextMenu = document.createElement('ul')
    contextMenu.classList.add('context')
    contextMenu.style.top = event.offsetY + 'px'
    contextMenu.style.left = event.offsetX + 'px'
    element.append(contextMenu)
    desktopContextMenu.map((element) => {
      if (element.length > 1) {
        for (let item of element) {
          contextMenu.insertAdjacentHTML('beforeend', `<li>${item}</li>`);
        }
        contextMenu.insertAdjacentHTML('beforeend', `<hr>`);
      } else {
        contextMenu.insertAdjacentHTML('beforeend', `<li>${element}</li>`);
      }
    })
  }
}
const deleteContextMenu = () => {
  if (desktop.querySelector('.context')) desktop.querySelector('.context').remove()
}


//folders.forEach(folder => folder.addEventListener('mousedown', mousedownHandler))
//folders.forEach(folder => folder.addEventListener('click', clickFoldersHandler));
//folders.forEach(folder => folder.addEventListener('dblclick', dblclickFoldersHandler));
desktop.addEventListener('mousedown', highlightHandler)
//document.addEventListener('click', clickWindowHandler)
//document.addEventListener('contextmenu', contextMenuHandler)

