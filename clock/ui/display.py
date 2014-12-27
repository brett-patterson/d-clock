from PySide.QtCore import Qt
from PySide.QtGui import QFont, QFontMetrics, QLabel, QPalette


class Display(QLabel):
    """ The main display for the clock interface.

    """
    def __init__(self, *args, **kwargs):
        """ Initialize the display.

        """
        super(Display, self).__init__(*args, **kwargs)
        self.setAlignment(Qt.AlignCenter)
        self.setWordWrap(True)

        palette = self.palette()
        palette.setColor(QPalette.Background, Qt.white)
        self.setAutoFillBackground(True)
        self.setPalette(palette)

    def setText(self, text):
        """ Reimplement the setText method to resize the font accordingly.

        Parameters:
        -----------
        text : string
            The text to display.

        """
        super(Display, self).setText(text)
        self.resize_font()

    def resizeEvent(self, event):
        """ Reimplement the resize event to resize the font when the widget's
        bounds change.

        Parameters:
        -----------
        event : QResizeEvent
            The resize event.

        """
        super(Display, self).resizeEvent(event)
        self.resize_font()

    def resize_font(self):
        """ Resize the display's font size to the maximum that will fit within
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
