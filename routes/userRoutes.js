import express from 'express';
import { bulkCreateUsers, bulkUpdateUsers } from '../controllers/userController.js';
import { validateBulkPayload } from '../middlewares/validator.js';

const router = express.Router();

router.post('/bulk-create', validateBulkPayload, bulkCreateUsers);
router.put('/bulk-update', validateBulkPayload, bulkUpdateUsers);

export default router;
