from PySide.QtGui import QVBoxLayout, QWidget

from d_clock.config import Config
from large_label import LargeLabel


class ClockView(QWidget):
    """ A widget to display a Clock object.

    """
    def __init__(self, clock, timer, *args, **kwargs):
        """ Initialize the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        timer : QTimer
            The timer used to update the clock.

        """
        super(ClockView, self).__init__(*args, **kwargs)
        self.setup_ui()
        self.set_clock(clock)

        timer.timeout.connect(self.update_clock)

    def setup_ui(self):
        """ Create the UI for the view.

        """
        layout = QVBoxLayout()

        self.clock_label = LargeLabel()
        layout.addWidget(self.clock_label)

        self.setLayout(layout)

    def set_clock(self, clock):
        """ Set the clock being displayed by the view.

        Parameters:
        -----------
        clock : Clock
            The clock object to display.

        """
        self.clock = clock
        self.update_clock()

    def update_clock(self):
        """ Update the clock's display.

        """
        clock_format = Config.get('CLOCK_FORMAT', '{time}\n{day} {cycle}')
        message = clock_format.format(**self.clock.get_info())
        self.clock_label.setText(message)
