require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Log registered routes for debugging
  if (app._router) {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        routes.push({
          path: middleware.route.path,
          methods: middleware.route.methods,
        });
      } else if (
        middleware.name === "router" &&
        middleware.handle &&
        middleware.handle.stack
      ) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: handler.route.path,
              methods: handler.route.methods,
            });
          }
        });
      }
    });
    console.log("Registered routes:", routes);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
