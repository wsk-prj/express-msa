import { Router } from 'express';
import { storeRouter } from './store/store.router';
import { menuRouter } from './store/menu.router';

const router = Router();

router.use('/stores', storeRouter);
router.use('/menus', menuRouter);

export { router };
