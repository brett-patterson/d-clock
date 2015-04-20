import json
import os


class Config(object):
    """ Manages configuration options, serialization, and I/O.

    """
    def __init__(self, path):
        """ Initialize the config object.

        Parameters:
        -----------
        path : string
            The path to the config file.

        """
        self.path = path

        if os.path.isfile(path):
            with open(path, 'r') as config_file:
                self.config = json.loads(config_file.read())
        else:
            self.config = {}

    def get(self, name, default=None):
        """ Get a primitive configuration option.

        Parameters:
        -----------
        name : string
            The name of the configuration option.

        default : object
            The default to return if no configuration option is found.

        Returns:
        --------
        The primitive Python object corresponding to the option name or the
        default.

        """
        return self.config.get(name, default)

    def get_filename(self, name, default=None):
        """ Get a filename configuration option. The filename is returned as
        an absolute path relative to the top-level application directory.

        Parameters:
        -----------
        name : string
            The name of the configuration option.

        default : object
            The default to return if no configuration option is found.

        Returns:
        --------
        An absolute path string corresponding to the option name or the
        default.

        """
        filename = self.get(name, default=default)
        return os.path.join(os.path.dirname(__file__), filename)

    def get_instance(self, name, cls, default=None):
        """ Get an instance for a given configuration name and class. The class
        must implement an `unpack` class method, used to reconstruct the
        object, that takes one argument, the serialized data, and returns the
        reconstructed object.

        Parameters:
        -----------
        name : string
            The name of the configuration option.

        cls : class
            The class used to reconstruct the object.

        default : object
            The default to return if no configuration option is found.

        Returns:
        --------
        The reconstructed object or the default.

        """
        if name in self.config:
            return cls.unpack(self.config[name])

        return default

    def set(self, name, value):
        """ Set a primitive configuration option.

        Parameters:
        -----------
        name : string
            The name of the configuration option.

        value : object
            The value for the option.

        """
        self.config[name] = value

    def set_instance(self, name, instance):
        """ Set the instance for a configuration option. Instances must
        implement a `pack` method, used to serialize the object, that takes no
        arguments and returns a JSON-serializable object.

        Parameters:
        -----------
        name : string
            The name of the configuration option.

        instance : object
            The instance for the option.

        """
        self.config[name] = instance.pack()

    def write(self):
        """ Write all configuration options to the config file.

        """
        with open(self.path, 'w') as config_file:
            config_file.write(json.dumps(self.config, indent=2))


CONFIG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'config.json')
Config = Config(CONFIG_FILE_PATH)
