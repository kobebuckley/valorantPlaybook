import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { secretKey } from './config'; // Create this file to store your secret key

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    // You can fetch user information from a database based on jwtPayload.sub (user ID)
    const user = getUserFromDatabase(jwtPayload.sub);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from the session
passport.deserializeUser((id, done) => {
  const user = getUserById(id);
  done(null, user);
});

export default passport;
