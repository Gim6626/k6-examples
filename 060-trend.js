import http from 'k6/http';
import {Trend} from 'k6/metrics';

let succeededRequestsDurationTrend = new Trend('SucceededRequestsDurationTrend');
let failedRequestsDurationTrend = new Trend('FailedRequestsDurationTrend');

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
