import * as express from 'express';
import router from './routes/router';

(async () => {
  try {
    const app = express();
    const port = 3000;
    app.use(express.json());
    app.use(router);
    app.listen(port, () => console.log(`Express is listening on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
})();
