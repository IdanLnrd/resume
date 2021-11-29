import argparse
parser = argparse.ArgumentParser()
parser.add_argument('cv')
args = parser.parse_args()
cv = (args.cv)
from pyresparser import ResumeParser
data = ResumeParser(cv).get_extracted_data()
import json
pritty = (json.dumps(data, indent = 4))
print(pritty)