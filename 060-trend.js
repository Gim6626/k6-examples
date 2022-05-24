import http from 'k6/http';
import {Trend} from 'k6/metrics';

let succeededRequestsDurationTrend = new Trend('Succeeded Requests Duration Trend');
let failedRequestsDurationTrend = new Trend('Failed Requests Duration Trend');

export default function () {
    for (let i = 0; i < 100; ++i) {
        let response = http.get('http://test.k6.io');
        if (response.status === 200) {
            succeededRequestsDurationTrend.add(response.timings.duration);
        } else {
            failedRequestsDurationTrend.add(response.timings.duration);
        }
    }
}
