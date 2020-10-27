import argparse
import sys
import re

parser = argparse.ArgumentParser()
parser.add_argument("filename")
args = parser.parse_args()

p = re.compile('.*,(\\d+)$')

# Read key/value pairs from comment lines
f = open(args.filename)
for line in f:
    m = p.match(line)
    if m:
        d_mi = m.group(1)
        #d_km = m.group(2)
        #r_str = "{%s:%s}" % (d_mi, d_km)

        r_str = "{%s}" % d_mi
        line = line.replace("{distance}", r_str)
        print(line.strip())
    else:
        print(line.strip())
f.close()
