import { Router } from 'express';
import { storeRouter } from './store/store.router';

const router = Router();

router.use('/stores', storeRouter);

export { router };
