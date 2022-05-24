import http from 'k6/http';
import {Trend, Rate} from 'k6/metrics';

let durationTrendByTag = new Trend('Duration Trend');
let successRateByTag = new Rate('Success Rate');

export let options = {
    iterations: 10,
    vus: 1,
    thresholds: {
        'Duration Trend{type:http}': ['med < 140'],
        'Duration Trend{type:https}': ['med < 160'],
        'Success Rate{type:http}': ['rate > 0.99'],
        'Success Rate{type:https}': ['rate > 0.999'],
    },
}

export default function () {
    let response;
    for (let t of ['http', 'https']) {
        response = http.get(`${t}://test.k6.io/news.php`, {tags: {type: t}});
        durationTrendByTag.add(response.timings.duration, {type: t});
        successRateByTag.add(response.status === 200, {type: t});
    }
}
