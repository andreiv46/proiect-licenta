import { Router } from 'express';
import { getPersonalPaymentsOverviewHandler } from '../controller/analytics.controller';

const router = Router();

router
.get("/overview/personal-payments", getPersonalPaymentsOverviewHandler)
// .get("/overview/shared-payments", getSharedPaymentsOverviewHandler)

export default router;