import { Router } from 'express';
import {
  saveTimetableHistory,
  getTimetableHistory,
  getTimetableHistoryById,
  compareTimetableHistory,
} from '../controllers/timetable-history.controller';

const router = Router();

router.post('/classes/:classId/history', saveTimetableHistory);
router.get('/classes/:classId/history', getTimetableHistory);
router.get('/history/:id', getTimetableHistoryById);
router.get('/history/compare/:id1/:id2', compareTimetableHistory);

export default router;
