import argparse
import json
import sys
import csv

parser = argparse.ArgumentParser()
parser.add_argument("infilename")
parser.add_argument("outfilename")
args = parser.parse_args()

expected_keys = ['id', 'name', 'description',
                 'units', 'source', 'type']

# Read key/value pairs from comment lines
f = open(args.infilename)
data = json.load(f)

csvout = open(args.outfilename, "w")

for key in expected_keys:
    csvout.write("# %s: %s\n" % (key, data[key]))

for week in data["schedule"]:
    for workout in week["workouts"]:

        # print(str(workout))
        description = workout["description"].encode(
            "unicode_escape").decode("utf-8")
        distance_mi = workout["distance"]
        distance_km = distance_mi * 1.60934

        csvout.write('"%s","",%.1f,%.1f\n' %
                     (description, distance_mi, distance_km))
