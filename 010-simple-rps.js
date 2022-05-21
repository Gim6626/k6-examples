import http from 'k6/http';
import {sleep} from 'k6';

export let options = {
    scenarios: {
        example_scenario: {
            // Simplest executor ("A fixed number of VUs execute as many iterations as possible for a specified amount
            // of time", for details see https://k6.io/docs/using-k6/scenarios/executors/constant-vus/)
            executor: 'constant-vus',
            // Threads count, we need to generate 50 requests every second, so as the first approximation we think that
            // 50 threads will be enough
            vus: 50,
            // For simplicity we will not perform long test
            duration: '30s',
            // By default it is 30s to let all threads quit gracefuly, we don't need it
            gracefulStop: '2s',
        }
    }
};

export default function () {
    http.get('http://test.k6.io');
    sleep(1);
}
