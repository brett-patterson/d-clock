import sys

from PySide.QtGui import QApplication

from app.clock import Clock
from config import Config
from ui.window import Window


def main():
    app = QApplication(sys.argv)
    clock = Clock()
    window = Window(clock)

    if Config.get('FULLSCREEN', True):
        window.showFullScreen()
    else:
        window.showNormal()

    sys.exit(app.exec_())
