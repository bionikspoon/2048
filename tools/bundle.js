import webpack from 'webpack';
import task from './lib/task';
import config from './webpack.config';

function bundle() {
  return new Promise((resolve, reject) => {
    const bundler = webpack(config);
    const run = (err, stats) => {
      if (err) {
        reject(err);
      }
      else {
        console.log(stats.toString(config[0].stats));
        resolve();
      }
    };
    bundler.run(run);
  });
}

export default task(bundle);
