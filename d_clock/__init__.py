import sys

from PySide.QtGui import QApplication

from app.clock import Clock
from ui.window import Window


def main():
    app = QApplication(sys.argv)
    clock = Clock()
    window = Window(clock)
    window.showFullScreen()
    sys.exit(app.exec_())
