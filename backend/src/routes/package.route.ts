import { Router } from 'express';
import { getPackages, createPurchaseRequest, getMyPurchaseRequests } from '../controllers/package.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPackages);
router.post('/purchase-requests', requireAuth, createPurchaseRequest);
router.get('/purchase-requests/my', requireAuth, getMyPurchaseRequests);

export default router;
