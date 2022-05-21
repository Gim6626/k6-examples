import http from 'k6/http';
import {Rate} from 'k6/metrics';

let quickResponsesRate = new Rate('QuickResponsesRate');

export default function () {
    for (let i = 0; i < 100; ++i) {
        let response = http.get('http://test.k6.io');
        quickResponsesRate.add(response.timings.duration < 180);
    }
}
