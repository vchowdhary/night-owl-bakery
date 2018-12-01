################################# scoring.py ###################################
# Define a function here to rate an employer-employee pairing. Used in the     #
# main file to populate the "score" header in the matching CSV file.           #
################################################################################

import random;
from constants import *;

# r := employer
# e := employee
def score(r, e):
    dist = 0

    for likert in LIKERTS:
            key = 'likert.%s' % (likert)
            dist += (r[key] - e[key]) ** 2

    for semDiff in SEMDIFFS:
            key = 'semDiff.%s' % (semDiff)
            dist += (r[key] - e[key]) ** 2

    maxDist = (4 ** 2) * len(LIKERTS) + (4 ** 2) * len(semDiff)

    return (maxDist - dist) / maxDist

