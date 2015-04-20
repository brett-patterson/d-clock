import sys

from PySide.QtCore import QTimer
from PySide.QtGui import QAction, QMainWindow, QMenu, QWidget, QVBoxLayout

from d_clock.config import Config
from clock_view import ClockView
from message_view import MessageView
from preferences_dialog import PreferencesDialog


class Window(QMainWindow):
    """ The main window of the application.

    """
    def __init__(self, clock, message_source, *args, **kwargs):
        """ Initialize the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        """
        super(Window, self).__init__(*args, **kwargs)

        self.timer = QTimer()
        self.clock_view = ClockView(clock, self.timer)
        self.message_view = MessageView(clock, message_source, self.timer)

        self.setup_ui()
        self.timer.start(1000)

    def setup_ui(self):
        """ Setup the UI for the window.

        """
        central_widget = QWidget()
        layout = QVBoxLayout()
        layout.addWidget(self.clock_view)
        layout.addWidget(self.message_view)
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)

        menubar = self.menuBar()

        file_menu = QMenu('File')

        preferences_action = QAction('Preferences', file_menu)
        preferences_action.triggered.connect(self.on_preferences_triggered)

        quit_action = QAction('Quit', file_menu)
        quit_action.triggered.connect(self.on_quit_triggered)

        file_menu.addAction(preferences_action)
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

    def on_preferences_triggered(self):
        """ The handler for when the 'Preferences' action is triggered.

        """
        self.preferences_dialog = PreferencesDialog()
        self.preferences_dialog.show()

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
