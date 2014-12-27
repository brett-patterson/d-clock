import datetime


DEFAULT_CYCLES = [
    ('morning', datetime.time(2)),
    ('afternoon', datetime.time(11)),
    ('evening', datetime.time(17)),
    ('night', datetime.time(20))
]

CLOCK_FORMAT = "{time}\n{day} {cycle}"
