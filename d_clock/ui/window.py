from PySide.QtGui import QMainWindow

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
