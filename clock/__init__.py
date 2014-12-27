import sys

from PySide.QtGui import QApplication

from app.clock import Clock
from ui.view import View


def main():
    app = QApplication(sys.argv)
    clock = Clock('01:35 PM\nSunday afternoon')
    view = View(clock)
    view.showFullScreen()
    sys.exit(app.exec_())
