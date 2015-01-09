import datetime

from d_clock.config import Config
from cycles import Cycles


class Clock(object):
    """ The top-level object representing the entire clock.

    """
    def __init__(self):
        """ Initialize the clock.

        """
        self.cycles = Config.get_instance('CYCLES', Cycles, default=Cycles())

    def when(self):
        """ Get the clock's current date and time.

        Returns:
        --------
        A datetime object.

        """
        return datetime.datetime.now()

    def get_info(self):
        """ Get the clock's info.

        Returns:
        --------
        A dictionary of the clock's info represented as strings. Valid keys are
        'time', 'day', and 'cycle'.

        """
        now = self.when()
        return {
            'time': now.strftime('%I:%M %p'),
            'day': now.strftime('%A'),
            'cycle': self.cycles.cycle_for_time(now.time())
        }
