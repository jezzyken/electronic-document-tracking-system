const fs = require("fs");
const globalErrorHandler = require('./controllers/errorController');
require('dotenv').config({path: './.env'});
const API_VERSION = process.env.API_VERSION;
const SERVER = process.env.SERVER;

const serverRoutes = (app) => {
  const routeFiles = fs.readdirSync(`./routes/${API_VERSION}`);
  console.log(routeFiles)

  routeFiles.forEach((routeFile) => {
    if (routeFile.endsWith(".js")) {  
      const routePath = routeFile
        .replace(".js", "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();
      const routeModule = require(`./routes/${API_VERSION}/${routeFile}`);
      app.use(`/api/${API_VERSION}/${SERVER}/${routePath}`, routeModule);
      console.log(`/api/${API_VERSION}/${SERVER}/${routePath}`)
      app.use(globalErrorHandler);
    }
  });
};

module.exports = serverRoutes;
