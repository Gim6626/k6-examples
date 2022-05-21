import http from 'k6/http';
import {Counter} from 'k6/metrics';

let requestsCounter = new Counter('RequestsCounter');

export default function () {
    for (let i = 0; i < 10; ++i) {
        http.get('http://test.k6.io');
        requestsCounter.add(1);
    }
}
