import { Router } from 'express';

import {
  startRegistration,
  verifyRegistration,
  startAuthentication,
  verifyAuthentication
} from './webauthn-controller.mts';

const router = Router();

router.post('/register', startRegistration);
router.post('/register/verify', verifyRegistration);
router.post('/authenticate', startAuthentication);
router.post('/authenticate/verify', verifyAuthentication);

export { router as webauthnRouter };