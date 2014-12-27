from PySide.QtCore import Qt
from PySide.QtGui import QFont, QFontMetrics, QLabel


class LargeLabel(QLabel):
    """ A label that grows its text to the largest size possible.

    """
    def __init__(self, *args, **kwargs):
        """ Initialize the display.

        """
        super(LargeLabel, self).__init__(*args, **kwargs)
        self.setAlignment(Qt.AlignCenter)
        self.setWordWrap(True)

    def setText(self, text):
        """ Reimplement the setText method to resize the font accordingly.

        Parameters:
        -----------
        text : string
            The text to display.

        """
        super(LargeLabel, self).setText(text)
        self.resize_font()

    def resizeEvent(self, event):
        """ Reimplement the resize event to resize the font when the widget's
        bounds change.

        Parameters:
        -----------
        event : QResizeEvent
            The resize event.

        """
        super(LargeLabel, self).resizeEvent(event)
        # self.resize_font()

    def resize_font(self):
        """ Resize the label's font size to the maximum that will fit within
        the boundaries of the widget.

        """
        width = self.width()
        height = self.height()
        font = self.font()
        text = self.text()

        size = 1
        font.setPointSize(size)
        bounds = QFontMetrics(font).boundingRect(text)

        while bounds.width() <= width and bounds.height() <= height:
            size += 1
            font.setPointSize(size)
            bounds = QFontMetrics(font).boundingRect(text)

        self.setFont(font)
