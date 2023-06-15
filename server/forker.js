/* eslint-disable @typescript-eslint/no-var-requires */
const cluster = require('cluster');
const os = require('os');

const clusterSize = Math.min(os.cpus().length, 4);

if (cluster.isPrimary) {
  (async () => {
    for (let i = 0; i < clusterSize; i++) {
      cluster.fork();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  })();
} else {
  require('./server');
}
