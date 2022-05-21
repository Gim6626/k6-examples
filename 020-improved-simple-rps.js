import http from 'k6/http';
// 'sleep' import is not needed anymore cause we've changed the way we pace requests

export let options = {
    scenarios: {
        // To make some advanced options available we need to make more complicated
        // options structure
        example_scenario: {
            // Constant rate, not VUs (see docs https://k6.io/docs/using-k6/scenarios/executors/)
            executor: 'constant-arrival-rate',
            // If we look at the statistics from previous run, we see that 95-percentile
            // of request duration is near 350 ms (but we expected requests to be every
            // 1s).
            // Simple math:
            // 1. Test duration / 95-percentile duration = 30 s / 350 ms = 85 requests for one thread per testing period
            // 2. Test duration * Desired RPS = 30 s * 50 rps = 1500 requests total needed for test
            // 3. Total needed requests / Requests for one thread = 1500 / 85 = 17.64 threads, let it be 20
            // Whole formula: (Test duration * Desired RPS) / (Test duration / 95-percentile duration)
            // Simplified: Desired RPS * 95-percentile duration
            // Note - VUs hear are a kind of threads pool size for scenario executors, don't think
            // about them as about your system users!
            preAllocatedVUs: 20,
            maxVUs: 20,
            // We set rate and timeunit exactly same as the RPS that we need
            rate: 50,
            timeUnit: '1s',
            // We still don't want to wait much
            duration: '30s',
            gracefulStop: '2s',
        }
    }
};
export default function () {
    http.get('http://test.k6.io');
    // As you see there are not more `sleep` here cause we changed the way how we execute scenario.
    // Now we don't control VUs and delays between requests manually, we delegate it to k6.
}
