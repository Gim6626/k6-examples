import {sleep} from 'k6';

const availableScenarios = {
    scenario1: {
        executor: 'constant-vus',
        vus: 1,
        duration: '1s',
        exec: 'scenario1',
    },
    scenario2: {
        executor: 'constant-vus',
        vus: 1,
        duration: '1s',
        exec: 'scenario2',
    },
};

let enabledScenarios = {}

// Hack to add k6 scenario selection from command line.
// Option supports one scenario or multiple scenarios names separated by ",".
// No option means execute all scenarios from file.
// Usage example: k6 run 127-scenario-selector.js --env scenarios=scenario2
if (__ENV.scenarios) {
    __ENV.scenarios.split(',').forEach(scenario => enabledScenarios[scenario] = availableScenarios[scenario]);
} else {
    enabledScenarios = availableScenarios;
}

export let options = {
    scenarios: enabledScenarios,
};

export function scenario1(data) {
    console.log(1);
    sleep(0.5);
}

export function scenario2(data) {
    console.log(2);
    sleep(0.5);
}
