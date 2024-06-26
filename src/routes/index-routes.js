import { Router } from 'express';
import noteRoutes from '@/routes/notes-routes';

import { lucia } from '@/lib/lucia';

import authRouter from './auth-routes';
const router = Router();

//check login

router.use(async (req, res, next) => {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	}
	if (!session) {
		res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
	}
	res.locals.session = session;
	res.locals.user = user;
	return next();
});
authRouter.get('/', (req, res) => {
    res.send("helo wolrd");
});

router.use('/notes', noteRoutes);
router.use('/', authRouter);
// router.use('/test', testRoutes);
export default router;