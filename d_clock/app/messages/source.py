import json
import os

from message import Message


class Source(object):
    """ The base class for all message sources.

    """
    def messages(self):
        """ Returns a list of Message objects. Must be implemented by
        subclasses.

        """
        return []


class FileSource(Source):
    """ A message source that reads from a file. The file should contain a
    JSON-formatted list of messages. Messages are read lazily from the file.
    Specifically, each time the `messages` method is called, the file will
    be re-parsed.

    """
    def __init__(self, filename):
        """ Initialize the FileSource.

        Parameters:
        -----------
        filename : str
            The name of the file to read messages from.

        """
        self.filename = filename

    def messages(self):
        """ Return a list of Message objects parsed from a JSON file.

        """
        if not os.path.isfile(self.filename):
            return []

        result = []
        with open(self.filename, 'r') as f:
            try:
                message_json = json.loads(f.read())

                for data in message_json:
                    result.append(Message.unpack(data))

                return result

            except ValueError:
                return result
