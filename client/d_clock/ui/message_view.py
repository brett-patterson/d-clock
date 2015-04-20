from PySide.QtCore import Qt
from PySide.QtGui import QLabel


class MessageView(QLabel):
    """ A widget to display messages. Currently only displays one message at a
    time.

    """
    def __init__(self, clock, source, timer, *args, **kwargs):
        """ Initialize the MessageView.

        Parameters:
        -----------
        clock : Clock
            The clock used determine when messages should be displayed.

        source : Source
            The source used to fetch messages.

        timer : QTimer
            The timer used to update the messages.

        """
        super(MessageView, self).__init__(*args, **kwargs)
        self.clock = clock
        self.source = source

        self.setup_ui()

        self.update_messages()
        timer.timeout.connect(self.update_messages)

    def setup_ui(self):
        """ Create the UI for the view.

        """
        self.setAlignment(Qt.AlignCenter)
        self.setTextFormat(Qt.RichText)

    def update_messages(self):
        """ Fetch messages from the source and update the UI.

        """
        for message in self.source.messages():
            if message.should_show(self.clock.when()):
                self.setText(message.html)
                self.source.consume_message(message)
                break
