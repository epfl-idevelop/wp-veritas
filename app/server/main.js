import helmet from "helmet";
import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import { loadFixtures } from "./fixtures";

import "../imports/api/publications"; // Call meteor publications backend
import "../imports/api/methods"; // Call meteor methods backend
import "../imports/api/methods/tags";
import "../imports/api/methods/themes";
import "../imports/api/methods/professors";
import "../imports/api/methods/categories";
import "../imports/api/methods/openshift-env";
import "../imports/api/methods/sites";

import { importData } from "./import-data";
import { AppLogger } from "../imports/api/logger";
import "./indexes";

import { getEnvironment } from "../imports/api/utils";

let importDatas = false;
// Warning: Tequila is needed to create the DB entries the first time that
// you run the app — afterwards you can disable it to have more dev comfort.
let disableTequila = getEnvironment() === "LOCALHOST" ? true : false;

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Define lang <html lang="fr" />
    WebApp.addHtmlAttributeHook(() => ({ lang: "fr" }));

    // https://guide.meteor.com/security.html#httpheaders
    WebApp.connectHandlers.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["*"],
          imgSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
        browserSniff: false,
      })
    );

    // Setting up logs
    new AppLogger();

    if (importDatas) {
      importData();
    }

    loadFixtures();

    if (!disableTequila) {
      import "./tequila-config";
    }
    import "./rest-api";
    import "./cron";

    SyncedCron.start();
  });
}
