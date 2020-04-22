import { Meteor } from "meteor/meteor";
import { Sites, Statistics } from "../imports/api/collections";

themeLightPodSubdomainsLiteStats = () => {
  let sites = Sites.find({}).fetch();
  let count = 0;

  for (let site of sites) {
    // exclude unmanaged sites
    if (site.openshiftEnv.startsWith("unm-")) {
      continue;
    }

    // exclude sites outside WordPress infrastructure
    if (!site.wpInfra) {
      continue;
    }

    if (
      (site.theme === "wp-theme-light" &&
        site.openshiftEnv !== "subdomains-lite") ||
      (site.theme !== "wp-theme-light" &&
        site.openshiftEnv === "subdomains-lite")
    ) {
      console.debug(`Site ${site.url} a un problème de données`);
      console.log(site);
    }

    if (
      site.theme === "wp-theme-light" &&
      site.openshiftEnv === "subdomains-lite"
    ) {
      count++;
    }
  }

  console.log("Nombre de sites avec le thème light et du pod lite: ", count);
};

subdomainsStats = () => {
  let subdomainsSites = Sites.find({ openshiftEnv: "subdomains" }).fetch();
  for (let site of subdomainsSites) {
    if (site.url === "https://wp-metrics.epfl.ch") {
      continue;
    } else {
      console.debug(`Site ${site.url} présent dans le pod subdomains`);
    }
  }
};

theme2018Stats = () => {
  let sites = Sites.find({ openshiftEnv: { "$in": ["www", "labs"] } }).fetch();
  let count = 0;

  for (let site of sites) {

    console.log(site);

    // exclude unmanaged sites
    if (site.openshiftEnv.startsWith("unm-")) {
      continue;
    }

    // exclude sites outside WordPress infrastructure
    if (!site.wpInfra) {
      continue;
    }

    if (site.theme !== "wp-theme-2018") {
      console.debug(`Site ${site.url} a un problème de données`);
      console.log(site);
      
      count++;
    }
  }
  console.log("Nombre de sites appartenant aux pods www et labs n'ayant pas le thème : ", count);
};

themeLightPodSubdomainsLiteStats();
subdomainsStats();
theme2018Stats();
