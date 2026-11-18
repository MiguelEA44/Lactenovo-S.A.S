import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '60s', target: 30 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const response = http.get('http://localhost:30080/health');

  check(response, {
    'respuesta HTTP 200': (r) => r.status === 200,
  });

  sleep(0.2);
}
