import sys

from PySide.QtGui import QApplication

from app.clock import Clock
from config import Config
from ui.window import Window


def main():
    app = QApplication(sys.argv)
    clock = Clock()
    window = Window(clock)
    window.show()

    def run():
        ret = app.exec_()
        Config.write()
        return ret

    sys.exit(run())
