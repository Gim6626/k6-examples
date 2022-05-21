import http from 'k6/http';
import {Rate} from 'k6/metrics';

let slowRequestsRate = new Rate('Slow Requests Rate');

export let options = {
    'thresholds': {
        'Slow Requests Rate': ['rate < 0.05'], // Slow requests count should be no more than 5%
    }
};

export default function () {
    let response;
    for (let i = 0; i < 100; ++i) {
        response = http.get('http://test.k6.io');
        slowRequestsRate.add(response.timings.duration > 200);
    }
}
