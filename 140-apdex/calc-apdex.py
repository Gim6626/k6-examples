#!/usr/bin/env python3

import argparse
import json
import sys
from pprint import pprint


def main():
    parser = argparse.ArgumentParser(description='Calculate APDEX basing on k6 JSON report')
    parser.add_argument('INPUT_DATA_JSON_PATH',
                        help='Path to JSONs with k6 report')
    args = parser.parse_args()
    with open(args.INPUT_DATA_JSON_PATH, 'r') as fin:
        data = json.load(fin)

    counts = {}
    for counter_type in ('SatisfiedCounter', 'ToleratingCounter', 'FrustratedCounter'):
        one_count = data['metrics'][counter_type]['count'] if counter_type in data['metrics'] else 0
        counts[counter_type] = one_count

    apdex = (counts['SatisfiedCounter'] + counts['ToleratingCounter'] / 2)\
            / (counts['SatisfiedCounter'] + counts['ToleratingCounter'] + counts['FrustratedCounter'])

    print(apdex)


if __name__ == "__main__":
    sys.exit(main())
