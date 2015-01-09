class Source(object):
    """ The base class for all message sources.

    """
    def messages(self):
        """ Returns a list of Message objects. Must be implemented by
        subclasses.

        """
        return []
