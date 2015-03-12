from datetime import datetime

from d_clock.constants import (ONCE, HOURLY, DAILY, WEEKLY,
                               PACK_DATE_TIME_FORMAT)


class Message(object):
    """ A text/image message that can be sent to the clock display.

    """
    def __init__(self, html="", recurring=ONCE,
                 target=datetime.now()):
        """ Initialize the Message object.

        Parameters:
        -----------
        html : str
            The HTML to display in the message.

        recurring : int
            How the message should recur. Uses constants defined as integers.

        target : datetime
            The day and time to show the message.

        """
        self.html = html
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

        if self.recurring == ONCE:
            return delta.days == 0 and delta.seconds == 0

        elif self.recurring == HOURLY:
            return (when.time().minute == self.target.time().minute and
                    when.time().second == self.target.time().second)

        elif self.recurring == DAILY:
            return (when.time().hour == self.target.time().hour and
                    when.time().minute == self.target.time().minute and
                    when.time().second == self.target.time().second)

        elif self.recurring == WEEKLY:
            return (when.date() == self.target.date() and
                    when.time().hour == self.target.time().hour and
                    when.time().minute == self.target.time().minute and
                    when.time().second == self.target.time().second)

        return False

    @classmethod
    def unpack(cls, data):
        """ Unpack a serialized message object.

        Parameters:
        -----------
        data : dict
            A dictionary describing the message.

        Returns:
        --------
        A reconstructed Message object.

        """
        return cls(
            html=data['html'],
            recurring=data['recurring'],
            target=datetime.strptime(data['target'], PACK_DATE_TIME_FORMAT)
        )
