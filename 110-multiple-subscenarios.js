import http from 'k6/http';
import {Trend, Rate, Counter} from 'k6/metrics';

let durationTrend = new Trend('Duration Trend');
let successRate = new Rate('Success Rate');
let requestsCounter = new Counter('Requests Counter');

const TIME_UNIT = '1s';
const DURATION_SECONDS = 60;
const GRACEFUL_STOP_SECONDS = 5;
const EXECUTOR = 'constant-arrival-rate';
const RPS_NEWS = 5;
const RPS_CONTACTS = 10;
const VUS_NEWS = 5;
const VUS_CONTACTS = 10;
const RPS_UNDERFLOW_FRACTION = 0.95;

export let options = {
    scenarios: {
        newsScenario: {
            executor: EXECUTOR,
            rate: RPS_NEWS,
            preAllocatedVUs: VUS_NEWS,
            maxVUs: VUS_NEWS,
            timeUnit: TIME_UNIT,
            duration: `${DURATION_SECONDS}s`,
            gracefulStop: `${GRACEFUL_STOP_SECONDS}s`,
            exec: 'newsSubscenario',
        },
        contactsScenario: {
            executor: EXECUTOR,
            rate: RPS_CONTACTS,
            preAllocatedVUs: VUS_CONTACTS,
            maxVUs: VUS_CONTACTS,
            timeUnit: TIME_UNIT,
            duration: `${DURATION_SECONDS}s`,
            gracefulStop: `${GRACEFUL_STOP_SECONDS}s`,
            exec: 'contactsSubscenario',
        },
    },
    thresholds: {
        'Duration Trend{subscenario:news}': ['med < 140'],
        'Duration Trend{subscenario:contacts}': ['med < 160'],
        'Success Rate{subscenario:news}': ['rate > 0.99'],
        'Success Rate{subscenario:contacts}': ['rate > 0.999'],
        'Requests Counter{subscenario:news}': [`rate > ${RPS_NEWS * RPS_UNDERFLOW_FRACTION}`],
        'Requests Counter{subscenario:contacts}': [`rate > ${RPS_CONTACTS * RPS_UNDERFLOW_FRACTION}`],
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
