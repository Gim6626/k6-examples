import {Gauge} from 'k6/metrics';

let gaugeExample = new Gauge('GaugeExample');

export default function () {
    gaugeExample.add(1);
    gaugeExample.add(2);
    gaugeExample.add(5);
    gaugeExample.add(1);
}
