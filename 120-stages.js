import http from 'k6/http';
import {check} from 'k6';

const rampupDuration = '5s';
const stageDuration = '60s';
const stage1RPS = 1;
const stage2RPS = 10;
const stage3RPS = 20;
const stage4RPS = 30;
const stage5RPS = 40;

export let options = {
    discardResponseBodies: true,
    scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1s',
            preAllocatedVUs: 1,
            maxVUs: 100,
            stages: [
                {target: stage1RPS, duration: rampupDuration},
                {target: stage1RPS, duration: stageDuration},
                {target: stage2RPS, duration: rampupDuration},
                {target: stage2RPS, duration: stageDuration},
                {target: stage3RPS, duration: rampupDuration},
                {target: stage3RPS, duration: stageDuration},
                {target: stage4RPS, duration: rampupDuration},
                {target: stage4RPS, duration: stageDuration},
                {target: stage5RPS, duration: rampupDuration},
                {target: stage5RPS, duration: stageDuration},
            ],
        },
    },
};

export default function () {
    let response = http.get('https://test.k6.io');
    check(response, {
        'is response status 200': (r) => r.status === 200,
    });
}
