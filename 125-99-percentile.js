import http from 'k6/http';
import {Rate} from 'k6/metrics';

let quickResponsesRate = new Rate('QuickResponsesRate');

export let options = {
    summaryTrendStats: [
        'min',
        'avg',
        'med',
        'max',
        'p(90)',
        'p(95)',
        // By default 99-percentile is not printed,
        // so we explicitly say to k6 what we need
        // to be printed and 99-percentile among these
        'p(99)',
    ],
}

export default function () {
    for (let i = 0; i < 100; ++i) {
        let response = http.get('http://test.k6.io');
        quickResponsesRate.add(response.timings.duration < 180);
    }
}
