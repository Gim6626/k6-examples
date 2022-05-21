import http from 'k6/http';
import {check} from 'k6';

export default function () {
    let response = http.get('http://test.k6.io');
    check(response, {
        'Is response status 200': (r) => r.status === 201,
    });
}
