import sys

from PySide.QtGui import QAction, QMainWindow, QMenu

from d_clock.config import Config
from view import View


class Window(QMainWindow):
    """ A window to display a Clock view.

    """
    def __init__(self, clock, *args, **kwargs):
        """ Initialize the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        """
        super(Window, self).__init__(*args, **kwargs)
        self.view = View(clock)
        self.setCentralWidget(self.view)
        self.setup_ui()

    def setup_ui(self):
        """ Setup the UI for the window.

        """
        menubar = self.menuBar()

        file_menu = QMenu('File')

        quit_action = QAction('Quit', file_menu)
        quit_action.triggered.connect(self.on_quit_triggered)

        file_menu.addAction(quit_action)
        menubar.addMenu(file_menu)

        view_menu = QMenu('View')

        fullscreen_action = QAction('Fullscreen', view_menu)
        fullscreen_action.setCheckable(True)
        fullscreen_action.setChecked(Config.get('FULLSCREEN', True))
        fullscreen_action.setShortcut('Ctrl+Meta+F')
        fullscreen_action.toggled.connect(self.on_fullscreen_changed)

        view_menu.addAction(fullscreen_action)
        menubar.addMenu(view_menu)

    def on_quit_triggered(self):
        """ The handler for when the `Quit` action is triggered.

        """
        Config.write()
        sys.exit()

    def on_fullscreen_changed(self, checked):
        """ The handler for when the 'Fullscreen' action is toggled.

        """
        Config.set('FULLSCREEN', checked)

        if checked:
            self.showFullScreen()
        else:
            self.showNormal()
