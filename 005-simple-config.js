// Same as `$ k6 run --vus 10 --duration 10s 000-simplest.js`
import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  http.get('http://test.k6.io');
}
