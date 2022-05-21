import http from 'k6/http';
import {Trend, Rate} from 'k6/metrics';
import {group} from 'k6';

let durationTrendByGroup = new Trend('Duration Trend by Group');
let successRateByGroup = new Rate('Success Rate by Group');

export let options = {
    iterations: 10,
    vus: 1,
    thresholds: {
        'Duration Trend by Group{groupName:contacts}': ['med < 160'],
        'Duration Trend by Group{groupName:news}': ['med < 140'],
        'Success Rate by Group{groupName:contacts}': ['rate > 0.99'],
        'Success Rate by Group{groupName:news}': ['rate > 0.999'],
    },
}

function groupWithDuration(groupName, groupFunction) {
    let start = new Date();
    group(groupName, groupFunction);
    let end = new Date();
    durationTrendByGroup.add(end - start, {groupName: groupName});
}

export default function () {
    for (let g of ['contacts', 'news']) {
        groupWithDuration(g, function () {
            let response = http.get(`https://test.k6.io/${g}.php`);
            successRateByGroup.add(response.status === 200, {groupName: g});
        });
    }
}
