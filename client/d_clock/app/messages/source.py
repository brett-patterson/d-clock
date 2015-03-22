import base64
import json
import os

from ws4py.client.threadedclient import WebSocketClient
from ws4py.exc import HandshakeError

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
        try:
            message = Message.unpack(json.loads(unicode(msg)))
            print 'Got message: ', message.html
            self._source.add_message(message)
        except ValueError:
            print 'Error parsing message: %s' % msg


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

        # TODO: No hardcoded authentication
        self.client = MessageClient(self, host, headers=[('Authorization',
            'Basic %s' % base64.b64encode('brett.patterson@rice.edu:just67')),
            ('Sec-WebSocket-Protocol', 'message')])

        try:
            self.client.connect()
        except HandshakeError as e:
            # TODO: Show/log authentication error
            print e

    def add_message(self, message):
        """ Add a message to the source.

        Parameters:
        -----------
        message : Message
            The message to be added.

        """
        self._messages.append(message)

    def messages(self):
        """ Return a list of Message objects received from the server.

        """
        return self._messages

    def __del__(self):
        """ Close the websocket on object destruction.

        """
        self.client.close()
