const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

console.log("Passport configuration loading...");
console.log(
  "GitHub Client ID configured:",
  process.env.GITHUB_CLIENT_ID ? "Yes" : "No",
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub Strategy - only configure if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          `http://localhost:${process.env.PORT || 5000}/api/v1/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("GitHub OAuth callback triggered");
          console.log(
            "GitHub profile:",
            profile.username,
            profile.emails?.[0]?.value,
          );

          // Check if user exists by email
          let user = await User.findOne({
            email:
              profile.emails?.[0]?.value || `${profile.username}@github.com`,
          });

          if (!user) {
            // Create new user
            user = await User.create({
              fullName: profile.displayName || profile.username,
              email:
                profile.emails?.[0]?.value || `${profile.username}@github.com`,
              password: await bcrypt.hash(Math.random().toString(36), 10),
              profileImageURL: profile.photos?.[0]?.value || "",
            });
            console.log("Created new GitHub user:", user.email);
          } else {
            console.log("Found existing GitHub user:", user.email);
          }

          return done(null, user);
        } catch (error) {
          console.error("GitHub OAuth error:", error);
          return done(error, null);
        }
      },
    ),
  );
  console.log("GitHub OAuth strategy initialized");
} else {
  console.log("GitHub OAuth disabled (credentials not provided)");
}

module.exports = passport;
