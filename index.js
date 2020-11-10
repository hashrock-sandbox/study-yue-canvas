const gui = require('gui')

const win = gui.Window.create({ frame: true, transparent: false })
const size = { width: 400, height: 400 }

const menu = gui.MenuBar.create([
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        onClick: () => gui.MessageLoop.quit()
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'copy' },
      { role: 'cut' },
      { role: 'paste' },
      { role: 'select-all' },
      { type: 'separator' },
      { role: 'undo' },
      { role: 'redo' },
    ],
  },
])

win.setMenuBar(menu)


win.setContentSize(size)
win.onClose = () => gui.MessageLoop.quit()

const contentview = gui.Container.create()
contentview.setMouseDownCanMoveWindow(true)
win.setContentView(contentview)

const canvas = gui.Canvas.create(size, 1)

contentview.onDraw = (self, painter) => {
  painter.drawCanvas(canvas, size)
}

let oldX = 0;
let oldY = 0;
let down = false;

contentview.onMouseDown = (self, event) => {
  oldX = event.positionInView.x
  oldY = event.positionInView.y
  down = true
}
contentview.onMouseUp = (self, event) => {
  down = false
}

contentview.onMouseMove = (self, event) => {
  if (down) {
    const x = event.positionInView.x
    const y = event.positionInView.y
    const painter = canvas.getPainter()
    painter.setStrokeColor('#333399')
    painter.setLineWidth(10)
    painter.beginPath()
    painter.moveTo({ x: oldX, y: oldY })
    painter.lineTo({ x: x, y: y })
    painter.stroke()

    oldX = x;
    oldY = y;
    contentview.schedulePaint()

  }
}

win.center()
win.activate()

if (!process.versions.yode) {
  gui.MessageLoop.run()
  process.exit(0)
}