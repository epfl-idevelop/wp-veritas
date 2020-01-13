const utils = require('./utils');

const goInstanceWPPage = async (page) => {
  // Go on tags page
  await page.$eval('a[href="/search"]', e => e.click());
  await page.waitFor(500);
  console.log("Go on instance WordPress page OK");
}

const search = async (page) => {

  const selector = "#render-target > div > div > form > div.form-group > input";
  const value = "https://www.epfl.ch/campus/services/ressources-informatiques/publier-sur-le-web-epfl/";
  await page.type(selector, value);

}

module.exports.goInstanceWPPage = goInstanceWPPage;
module.exports.search = search;