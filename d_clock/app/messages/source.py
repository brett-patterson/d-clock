import json
import os

import websocket

from message import Message


def load_messages_from_json(data):
    """ Parse messages from a string of JSON data.

    Parameters:
    -----------
    data : str
        The data to be parsed.

    Returns:
    --------
    A list of parsed Message objects.

    """
    result = []
    try:
        message_json = json.loads(f.read())

        for data in message_json:
            result.append(Message.unpack(data))

        return result

    except ValueError:
        return result


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

        with open(self.filename, 'r') as f:
            return load_messages_from_json(f.read())


class WebSocketSource(Source):
    """ A message source that connects to a web socket and listens for
    messages.

    """
    def __init__(self, host):
        """ Initialize the WebSocketSource.

        Parameters:
        -----------
        host : str
            The hostname for the web socket server.

        """
        self._messages = []

        self._host = host
        self._ws = websocket.WebSocketApp(self._host, on_message=self._receive)
        self._ws.run_forever()

    def _receive(self, ws, data):
        """ Receive a message from the websocket server.

        Paramters:
        ----------
        ws : WebSocketApp
            The web socket connection object.

        data : str
            The message sent from the server.

        """
        self._messages.extend(load_messages_from_json(data))

    def messages(self):
        """ Return a list of Message objects received from the server.

        """
        return self._messages
