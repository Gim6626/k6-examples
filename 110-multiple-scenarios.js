import http from 'k6/http';
import {Trend, Rate} from 'k6/metrics';

let durationTrend = new Trend('Duration Trend by Scenario');
let successRate = new Rate('Success Rate by Scenario');

const timeUnit = '1s';
const durationSeconds = '10s';
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
            exec: 'newsScenario',
        },
        contactsScenario: {
            executor: executor,
            rate: 1,
            preAllocatedVUs: preAllocatedVUs,
            timeUnit: timeUnit,
            duration: durationSeconds,
            gracefulStop: gracefulStopSeconds,
            exec: 'contactsScenario',
        },
    },
    thresholds: {
        'Duration Trend by Scenario{scenario:news}': ['med < 140'],
        'Duration Trend by Scenario{scenario:contacts}': ['med < 160'],
        'Success Rate by Scenario{scenario:news}': ['rate > 0.99'],
        'Success Rate by Scenario{scenario:contacts}': ['rate > 0.999'],
    },
}

function gatherResponseStatistics(response, scenario) {
    successRate.add(response.status === 200, {scenario: scenario});
    durationTrend.add(response.timings.duration, {scenario: scenario});
}

export function newsScenario() {
    const scenario = 'news';
    let response = http.get(`https://test.k6.io/${scenario}.php`, {tags: {scenario: scenario}});
    gatherResponseStatistics(response, scenario);
}

export function contactsScenario() {
    const scenario = 'contacts';
    let response = http.get(`https://test.k6.io/${scenario}.php`, {tags: {scenario: scenario}});
    gatherResponseStatistics(response, scenario);
}
