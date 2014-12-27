import datetime

from d_clock.config import DEFAULT_CYCLES
from cycles import Cycles


class Clock(object):
    """ The top-level object representing the entire clock.

    """
    def __init__(self, info=datetime.datetime.now()):
        """ Initialize the clock.

        Parameters:
        -----------
        info : datetime
            The date and time to show on the clock. Defaults to the current
            date and time.

        """
        self.cycles = Cycles(DEFAULT_CYCLES)
        self.set_info(info)

    def set_info(self, info):
        """ Set the clock's info.

        info : datetime
            The date and time to show on the clock.

        """
        self.info = info
        self.time = info.time().strftime('%I:%M %p')
        self.day = info.strftime('%A')
        self.cycle = self.cycles.cycle_for_time(info.time())
