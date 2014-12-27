from PySide.QtGui import QVBoxLayout, QWidget

from d_clock.config import CLOCK_FORMAT
from large_label import LargeLabel


class View(QWidget):
    """ A widget to display a Clock object.

    """
    def __init__(self, clock, *args, **kwargs):
        super(View, self).__init__(*args, **kwargs)
        self.setup_ui()
        self.set_clock(clock)

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

        message = CLOCK_FORMAT.format(
            time=clock.time,
            day=clock.day,
            cycle=clock.cycle
        )

        self.clock_label.setText(message)
