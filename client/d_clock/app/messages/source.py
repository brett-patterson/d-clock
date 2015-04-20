import json
import os

from ws4py.client.threadedclient import WebSocketClient
from ws4py.exc import HandshakeError

from d_clock.config import Config
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
    def remove_message(self, message):
        """ Remove a message from the list of messages. Should be implemented
        by subclasses.

        Parameters:
        -----------
        message : Message
            The message to remove.

        """
        return None

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
        self._messages = []
        self.filename = filename

    def remove_message(self, message):
        """ Remove a message from the source.

        Parameters:
        -----------
        message : Message
            The message to remove

        """
        self._messages.remove(message)

        try:
            with open(self.filename, 'w') as f:
                f.write(json.dumps([m.pack() for m in self._messages]))

        except IOError:
            self._messages = []

    def messages(self):
        """ Return a list of Message objects parsed from a JSON file.

        """
        if not os.path.isfile(self.filename):
            self._messages = []

        else:
            try:
                with open(self.filename, 'r') as f:
                    self._messages = load_messages_from_json(f.read())

            except IOError:
                self._messages = []

        return self._messages


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
            if self._source.add_message(message):
                self.send(json.dumps({
                    'received': True,
                    'id': message.id
                }))

        except (ValueError, KeyError):
            # TODO: log this error
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
        self._host = host

        try:
            with open(Config.get_filename('WEB_SOURCE_STORE'), 'r') as f:
                self._messages = load_messages_from_json(f.read())
        except IOError:
            self._messages = []

        auth = Config.get('WS_AUTH')
        if auth is not None:
            self.client = MessageClient(self, host, headers=[
                                        ('Authorization', 'Basic %s' % auth),
                                        ('Sec-WebSocket-Protocol', 'message')])

            try:
                self.client.connect()
            except HandshakeError as e:
                # TODO: log authentication error
                print e

    def add_message(self, message):
        """ Add a message to the source.

        Parameters:
        -----------
        message : Message
            The message to be added.

        Returns:
        --------
        True if the message was added, False if the message had already been
        added.

        """
        if message.id not in [m.id for m in self._messages]:
            self._messages.append(message)
            self.save()
            return True

        return False

    def remove_message(self, message):
        """ Remove a message from the source.

        Parameters:
        -----------
        message : Message
            The message to remove

        """
        self._messages.remove(message)
        self.save()

    def messages(self):
        """ Return a list of Message objects received from the server.

        """
        return self._messages

    def save(self):
        """ Save the list of messages to the file system.

        """
        serialized = json.dumps([m.pack() for m in self._messages])
        with open(Config.get_filename('WEB_SOURCE_STORE'), 'w') as f:
            f.write(serialized)
