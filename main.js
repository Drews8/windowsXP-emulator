const folders = document.querySelectorAll('.folder')
const desktop = document.getElementById('desktop')
desktop.setAttribute('data-context', 'desktop')
const desktopContextMenu = [['Упорядочить значки', 'Обновить'], ['Вставить', 'Вставить ярлык'], ['Создать'], ['Свойства']]
let selectedItem, highlight
let cursordownX, cursordownY, highlightPointX, highlightPointY
let screenOffsetX = (window.innerWidth - desktop.offsetWidth) / 2,
  screenOffsetY = (window.innerHeight - desktop.offsetHeight) / 2


const selectFoldersHandler = event => {
  const closestFolder = event.target.closest('.folder')
  const curentSelected = document.querySelector('.highlighted')

  if (!event.target.closest('.folder').classList.contains('highlighted')) {
    if (curentSelected) {
      curentSelected.removeEventListener('mousedown', renameHandler)
      curentSelected.classList.remove('highlighted')
    }
    closestFolder.classList.add('highlighted')
    closestFolder.addEventListener('mousedown', renameHandler)
  }


}
const renameHandler = event => {
  event.preventDefault()
  console.log('tap')
  const currentFolder = event.target.closest('.folder')
  const submitTitleHandler = event => {

    if (event === 'outsideClick' || event.charCode === 13) {

      const input = document.querySelector('.rename')
      const title = document.createElement('div')
      title.className = 'title'

      title.innerHTML = input.value
      currentFolder.append(title)

      document.removeEventListener('click', renameTouchOut)
      if (!event.charCode) input.closest('.folder').removeEventListener('mousedown', renameHandler)

      input.remove()
    }
  }
  const renameTouchOut = event => {
    if (!event.target.closest('.rename')) submitTitleHandler('outsideClick')
  }

  let chosenTitle = event.target
  if (chosenTitle.classList.contains('title')) {

    let chosenInput = document.createElement('input')
    chosenInput.className = 'rename'
    chosenInput.setAttribute('value', chosenTitle.innerHTML)
    chosenInput.setAttribute('autofocus', 'autofocus')
    currentFolder.append(chosenInput)
    chosenTitle.remove()
    chosenInput.focus()
    chosenInput.select()

    chosenInput.addEventListener('keypress', submitTitleHandler)
    document.addEventListener('click', renameTouchOut)
  }
}
const dblclickFoldersHandler = event => {
  event.target.closest('.folder').classList.toggle('opened')
  openFolder()

}
const moveAt = (offsetX, offsetY) => {

  selectedItem.style.left = offsetX - cursordownX + 'px'
  selectedItem.style.top = offsetY - cursordownY + 'px'


}
const mouseMoveHandler = (event) => {
  console.dir(event)
  moveAt(event.pageX - screenOffsetX, event.pageY - screenOffsetY)

}
const mousedownHandler = event => {
  console.log(event.target)
  console.dir(event.target.closest('.folder'))
  selectedItem = event.target.closest('.folder')
  selectedItem.ondragstart = () => false
  cursordownX = event.pageX - screenOffsetX - selectedItem.offsetLeft
  cursordownY = event.pageY - screenOffsetY - selectedItem.offsetTop


  desktop.addEventListener('mouseup', mouseUpHandler)
  desktop.addEventListener('mousemove', mouseMoveHandler)
  selectFoldersHandler(event)
}
const mouseUpHandler = event => {
  desktop.removeEventListener('mousemove', mouseMoveHandler)
}
const highlightHandler = event => {

  if (event.target.id === 'desktop') {

    highlight = document.createElement('div')
    highlight.classList.add('highlight')

    highlightPointX = event.offsetX
    highlightPointY = event.offsetY
    screenOffsetX = event.pageX - event.offsetX
    screenOffsetY = event.pageY - event.offsetY

    highlight.style.left = highlightPointX
    highlight.style.top = highlightPointY

    desktop.append(highlight)
    desktop.addEventListener('mousemove', highlightMoveHandler)
    desktop.addEventListener('mouseup', highlightDelete)
  }
}

const highlightMoveHandler = event => {


  //if (event.target.id === 'desktop') {
  highlight.style.width = Math.abs((event.pageX - screenOffsetX) - highlightPointX) + 'px'
  highlight.style.height = Math.abs((event.pageY - screenOffsetY) - highlightPointY) + 'px'

  // hide highlight line
  if (event.offsetX === highlightPointX || event.offsetY === highlightPointY) {
    highlight.style.borderColor = 'rgba(0,0,0,0)'
  } else {
    highlight.style.borderColor = '#333'
  }
  // fix highlight point depending the side
  if ((event.pageX - screenOffsetX) < highlightPointX && (event.pageY - screenOffsetY) < highlightPointY) {
    highlight.style.left = (event.pageX - screenOffsetX) + 'px'
    highlight.style.right = highlightPointX + 'px'
    highlight.style.top = (event.pageY - screenOffsetY) + 'px'
    highlight.style.bottom = highlightPointY + 'px'


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


  //}

}

const highlightDelete = event => {
  desktop.querySelector('.highlight').remove()
  desktop.removeEventListener('mouseup', highlightDelete)
}
const clickWindowHandler = event => {
  if (event.target.id === 'desktop') {

    document.querySelectorAll('.highlight').forEach(highlight => highlight.remove())
    document.querySelectorAll('.highlighted').forEach(element => {
      //element.removeEventListener('mousedown', renameHandler)
      element.classList.remove('highlighted')
    })
    deleteContextMenu()
  }
}
const contextMenuHandler = event => {
  event.preventDefault()
  deleteContextMenu()
  renderContextMenu(event)
}

const renderContextMenu = (event) => {
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

const openFolder = () => {
  const openFolder = document.createElement('div')
  openFolder.className = 'openFolder'
  openFolder.innerHTML = `<div class="openFolder-header"></div>
                          <div class="openFolder-main">
                            <div class="openFolder-nav"></div>
                            <div class="openFolder-body">
                                <div class="openFolder-aside"></div>
                                <div class="openFolder-inner"></div>
                            </div>
                          </div>`
  desktop.append(openFolder)
}


folders.forEach(folder => folder.addEventListener('mousedown', mousedownHandler))
//folders.forEach(folder => folder.addEventListener('click', highlightFoldersHandler));
folders.forEach(folder => folder.addEventListener('dblclick', dblclickFoldersHandler));
desktop.addEventListener('mousedown', highlightHandler)
document.addEventListener('click', clickWindowHandler)
document.addEventListener('contextmenu', contextMenuHandler)


