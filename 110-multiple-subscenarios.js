import http from 'k6/http';
import {Trend, Rate, Counter} from 'k6/metrics';

let durationTrend = new Trend('Duration Trend');
let successRate = new Rate('Success Rate');
let requestsCounter = new Counter('Requests Counter');

const timeUnit = '1s';
const durationSeconds = '120s';
const gracefulStopSeconds = '1s';
const executor = 'constant-arrival-rate';
const preAllocatedVUs = 1;

export let options = {
    scenarios: {
        newsScenario: {
            executor: executor,
            rate: 4,
            preAllocatedVUs: preAllocatedVUs * 4,
            timeUnit: timeUnit,
            duration: durationSeconds,
            gracefulStop: gracefulStopSeconds,
            exec: 'newsSubscenario',
        },
        contactsScenario: {
            executor: executor,
            rate: 1,
            preAllocatedVUs: preAllocatedVUs,
            timeUnit: timeUnit,
            duration: durationSeconds,
            gracefulStop: gracefulStopSeconds,
            exec: 'contactsSubscenario',
        },
    },
    thresholds: {
        'Duration Trend{subscenario:news}': ['med < 140'],
        'Duration Trend{subscenario:contacts}': ['med < 160'],
        'Success Rate{subscenario:news}': ['rate > 0.99'],
        'Success Rate{subscenario:contacts}': ['rate > 0.999'],
        'Requests Counter{subscenario:news}': ['rate > 3.9'],
        'Requests Counter{subscenario:contacts}': ['rate > 0.9'],
    },
}

function gatherResponseStatistics(response, subscenario) {
    successRate.add(response.status === 200, {subscenario: subscenario});
    durationTrend.add(response.timings.duration, {subscenario: subscenario});
    requestsCounter.add(1, {subscenario: subscenario});
}

export function newsSubscenario() {
    const subscenario = 'news';
    let response = http.get(`https://test.k6.io/${subscenario}.php`, {tags: {subscenario: subscenario}});
    gatherResponseStatistics(response, subscenario);
}

export function contactsSubscenario() {
    const subscenario = 'contacts';
    let response = http.get(`https://test.k6.io/${subscenario}.php`, {tags: {subscenario: subscenario}});
    gatherResponseStatistics(response, subscenario);
}
