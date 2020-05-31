const folders = document.querySelectorAll('.folder')
const desktop = document.getElementById('desktop')
desktop.setAttribute('data-context', 'desktop')
const desktopContextMenu = [['Упорядочить значки', 'Обновить'], ['Вставить', 'Вставить ярлык'], ['Создать'], ['Свойства']]
let selectedItem, highlight
let cursordownX, cursordownY, highlightPointX, highlightPointY
let screenOffsetX = (window.innerWidth - desktop.offsetWidth) / 2,
  screenOffsetY = (window.innerHeight - desktop.offsetHeight) / 2


const clickFoldersHandler = event => {
  console.dir(event)
  const closestFolder = event.target.closest('.folder')

  if (!event.target.closest('.folder').classList.contains('highlighted')) {
    if(document.querySelector('.highlighted')){
      document.querySelector('.highlighted').classList.remove('highlighted')
    }
    closestFolder.classList.add('highlighted')
    closestFolder.addEventListener('mousedown', renameHandler)
  }

  // if(event.target.closest('.folder').classList.contains('highlighted'))
    //document.querySelector('.highlighted').classList.remove('highlighted')
    //event.target.removeEventListener('click', renameHandler)
  //event.target.addEventListener('click', renameHandler)


}
const renameHandler = event => {
  //console.dir(event)
  if(event.target.tagName === 'span'){
    alert('dick')
  }
}
const dblclickFoldersHandler = event => {
  event.target.closest('.folder').classList.toggle('opened')
  openFolder()

}
const mouseUpHandler = event => {
  desktop.removeEventListener('mousemove', mouseMoveHandler)
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
  selectedItem = event.target.closest('.folder')
  selectedItem.ondragstart = () => false
  cursordownX = event.pageX - screenOffsetX - selectedItem.offsetLeft
  cursordownY = event.pageY - screenOffsetY - selectedItem.offsetTop


  event.target.addEventListener('mouseup', mouseUpHandler)
  desktop.addEventListener('mousemove', mouseMoveHandler)
  clickFoldersHandler(event)
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


/*function resOut(res1, res2) {
  desktop.querySelector('.info').textContent = res1.toString() + '\n\n' + res2.toString();
}*/
