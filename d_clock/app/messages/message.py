from datetime import datetime

from d_clock.constants import ONCE, HOURLY, DAILY, WEEKLY


class Message(object):
    """ A text/image message that can be sent to the clock display.

    """
    def __init__(self, text="", image="", recurring=ONCE,
                 target=datetime.now()):
        """ Initialize the Message object.

        Parameters:
        -----------
        text : str
            The text to display in the message.

        image : str
            The image to display in the message.

        recurring : int
            Whether the message is recurring. Uses bitwise constants as flags.

        target : datetime
            The day and time to show the message.

        """
        self.text = text
        self.image = image
        self.recurring = recurring
        self.target = target

    def should_show(self, when):
        """ Determine whether the message should be shown at the given date
        and time.

        Parameters:
        -----------
        when : datetime
            The date and time to check against.

        Returns:
        --------
        A boolean representing whether the message should be shown or not.

        """
        delta = self.target - when

        if delta.days < 0:
            return False

        if self.recurring & ONCE:
            return delta.days == 0 and delta.seconds == 0

        if self.recurring & HOURLY:
            return when.time().minute == self.target.time().minute

        if self.recurring & DAILY:
            return (when.time().hour == self.target.time().hour and
                    when.time().minute == self.target.time().minute)

        if self.recurring & WEEKLY:
            return (when.date() == self.target.date() and
                    when.time().hour == self.target.time().hour and
                    when.time().minute == self.target.time().minute)

        return False
