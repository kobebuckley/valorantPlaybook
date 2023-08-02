import passport from './auth';

export const authenticateUser = passport.authenticate('jwt', { session: false });
