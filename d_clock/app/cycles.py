class Cycles(object):
    """ Manages the cycles for the clock, i.e. what is considered day, night,
    etc. Cycles are denoted by their start time and are assumed to continue
    until the next cycle's start time.

    """
    def __init__(self, cycles=[]):
        """ Initialize the Cycles object.

        Parameters:
        -----------
        cycles : list
            A list of (string, datetime.time) tuples where the string is the
            label for the cycle and the time object is the start time of the
            cycle.

        """
        self.cycles = []

        for cycle in cycles:
            self.add_cycle(*cycle)

    def add_cycle(self, label, marker):
        """ Add a cycle.

        Parameters:
        -----------
        label : string
            The label for the cycle.

        marker : datetime.time
            The start time for the cycle.

        """
        self.cycles.append((label, marker))
        self.cycles.sort(key=lambda c: c[1])

    def cycle_for_time(self, time):
        """ Get the cycle that a given time is within.

        Parameters:
        -----------
        time : datetime.time
            The given time.

        Returns:
        --------
        The label string for the cycle containing `time` or an empty string.

        """
        for index, cycle in enumerate(self.cycles):
            label, marker = cycle

            next_index = index + 1
            if next_index == len(self.cycles):
                return self.cycles[-1][0]

            next_marker = self.cycles[next_index][1]

            if time >= marker and time < next_marker:
                return label

        return ''
