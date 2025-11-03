const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const crypto = require('crypto')

const User = require('./models/user')
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        console.log('profile__')
        console.log(profile)
        // Try to find user by googleId
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          // If not found, try by email
          user = await User.findOne({ email: profile.email })

          if (user) {
            // If user with that email exists, link googleId and update photo if missing
            user.googleId = profile.id
            if (!user.photo && profile.picture) user.photo = profile.picture
            await user.save()
          } else {
            // If no user, create a new one
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.email,
              avatarUrl: profile.picture,
              authMethod: 'google',
              password: crypto.randomBytes(20).toString('hex'), // random password, unused
            })
          }
        }

        // Generate JWT token with your schema method
        const token = user.getSignedJwtToken()

        // Return user and token
        return done(null, { user, token })
      } catch (err) {
        console.log('error creating user : ', err)
        return done(err, null)
      }
    }
  )
)

passport.serializeUser((userWithToken, done) => {
  // We don't actually need session support if using JWT, but keep this minimal
  done(null, userWithToken.user._id)
})
// // This function is called on every request after login to fetch the full user based on the ID stored in the session.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
