from PySide.QtGui import QMainWindow

from display import Display


class View(QMainWindow):
    """ Displays a Clock object.

    """
    def __init__(self, clock, *args, **kwargs):
        """ Initialize the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        """
        super(View, self).__init__(*args, **kwargs)
        self.setup_ui()
        self.set_clock(clock)

    def setup_ui(self):
        """ Setup the user interface for the view.

        """
        self.display = Display()
        self.setCentralWidget(self.display)

    def set_clock(self, clock):
        """ Set the clock being displayed by the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        """
        self.clock = clock
        self.display.setText(clock.message)
