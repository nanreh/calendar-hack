import argparse
import json
import sys
import csv

parser = argparse.ArgumentParser()
parser.add_argument("filename")
args = parser.parse_args()

expected_keys = ['id', 'name', 'description',
                 'units', 'source', 'type']

result = {}


def handle_distance(dist_mi):
    return (round(dist_mi, 1), round(dist_mi * 1.60934, 1))


# Read key/value pairs from comment lines
f = open(args.filename)
for line in f:
    if line.startswith("#"):
        if ':' in line:
            line = line[1:].strip()
            (key, val) = line.split(':', 1)
            (key, val) = key.strip(), val.strip()
            if key in expected_keys:
                result[key] = val
                expected_keys.remove(key)

f.close()
if len(expected_keys):
    print("Missing keys: " + str(expected_keys))
    sys.exit()

result["schedule"] = []
week = []

f = open(args.filename)
rdr = csv.reader(filter(lambda row: row[0] != '#', f))
for row in rdr:
    title = row[0].replace("\\n", "\n")
    description = row[1].replace("\\n", "\n")
    (distance_mi, distance_km) = handle_distance(float(row[2]))
    # print("vals: %s %s %.1f %.1f" %
    #      (title, description, distance_mi, distance_km))
    week.append({
        "title": title,
        "description": description,
        # "distance_mi": distance_mi,
        # "distance_km": distance_km,
        "distance": distance_mi
    })
    if len(week) == 7:
        result["schedule"].append({"workouts": week})
        week = []
f.close()

if len(week) != 0:
    print("Fail: incomplete plan")
else:
    print(json.dumps(result, indent=3))
