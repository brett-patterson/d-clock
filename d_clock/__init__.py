import sys

from PySide.QtGui import QApplication

from app.clock import Clock
from app.messages.source import Source
from config import Config
from ui.window import Window


def main():
    app = QApplication(sys.argv)
    clock = Clock()
    source = Source()
    window = Window(clock, source)

    if Config.get('FULLSCREEN', True):
        window.showFullScreen()
    else:
        window.showNormal()

    sys.exit(app.exec_())
