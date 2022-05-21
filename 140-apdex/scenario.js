import http from 'k6/http';
import {Counter} from 'k6/metrics';

let satisfiedCounter = new Counter('SatisfiedCounter');
const satisfiedMaxMs = 150;
let toleratingCounter = new Counter('ToleratingCounter');
const toleratingMaxMs = 200;
let frustratedCounter = new Counter('FrustratedCounter');

export let options = {
    iterations: 100,
    vus: 10,
}

export default function () {
    let response = http.get('http://test.k6.io');
    const duration = response.timings.duration;
    if (duration < satisfiedMaxMs) {
        satisfiedCounter.add(1);
    } else if (duration < toleratingMaxMs) {
        toleratingCounter.add(1);
    } else {
        frustratedCounter.add(1);
    }
}
