from datetime import datetime, timedelta
now = datetime.now()
delta = timedelta(minutes=1)
one = now + delta
two = now + delta * 2
three = now + delta * 3

from message import Message


class Source(object):
    """ The base class for all message sources.

    """
    def messages(self):
        """ Returns a list of Message objects. Must be implemented by
        subclasses.

        """
        # raise NotImplementedError
        return [
            Message(text='This is message 1', target=one),
            Message(text='Now we are on message 2', target=two),
            Message(text='Finally, this is message 3', target=three)
        ]
