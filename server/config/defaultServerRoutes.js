const fs = require("fs");
const globalErrorHandler = require("../middleware/errorMiddleware");
require("dotenv").config();

const API_VERSION = process.env.API_VERSION;

const serverRoutes = (app) => {
  const routeFiles = fs.readdirSync(`./routes/${API_VERSION}`);

  console.log("Available route files:", routeFiles);

  routeFiles.forEach((routeFile) => {
    if (routeFile.endsWith(".js")) {
      const routePath = routeFile
        .replace(".js", "")
        .replace("Routes", "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();

      const routeModule = require(`../routes/${API_VERSION}/${routeFile}`);

      const fullPath = `/api/${API_VERSION}/${routePath}`;
      app.use(fullPath, routeModule);

      console.log(`Route registered: ${fullPath}`);
    }
  });

  app.use(globalErrorHandler);
};

module.exports = serverRoutes;
