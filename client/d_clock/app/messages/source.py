import json
import os

from ws4py.client.threadedclient import WebSocketClient

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
        message_list = json.loads(data)

        for message_json in message_list:
            try:
                result.append(Message.unpack(message_json))
            except ValueError:
                continue

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


class MessageClient(WebSocketClient):
    """ A web socket client to handle messages.

    """
    def __init__(self, source, *args, **kwargs):
        super(MessageClient, self).__init__(*args, **kwargs)
        self._source = source

    def received_message(self, msg):
        """ Receive a message from the websocket server.

        Parameters:
        ----------
        data : str
            The message sent from the server.

        """
        self._source.add_messages(load_messages_from_json(unicode(msg)))


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

        client = MessageClient(self, host)
        client.connect()

    def add_messages(self, messages):
        self._messages.extend(messages)

    def messages(self):
        """ Return a list of Message objects received from the server.

        """
        return self._messages

    def __del__(self):
        """ Close the websocket on object destruction.

        """
        self._client_thread.quit()
