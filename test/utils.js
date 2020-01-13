const puppeteer = require('puppeteer');


const config = async() => {
  const browser = await puppeteer.launch(
    { ignoreHTTPSErrors: true,devtools: false }
  );
  const page = await browser.newPage();
  await page.setViewport(
    { width: 1366, height: 1600 }
  )
  return [browser, page];
}

const goHome = async(page) => {
  const url = 'http://localhost:3000/';
  await page.goto(url);
  await page.waitFor(1000);
  console.log("Go Home OK");
} 

const goHomeTest = async(page) => {
  const url = 'http://wp-veritas.128.178.222.83.nip.io/';
  await page.goto(url);
  await page.waitFor(1000);
  console.log("Go Home OK");
} 


/**
 * Tequila login
 * @param {*} page 
 */

const login = async (page) => {
  await page.type('#username', 'charmier');
  await page.type('#password', 'L1nd2nattack');
  await page.click('#loginbutton');
  console.log("Login OK");
  await page.waitFor(5000);
}

const doScreenshot = async (page, fileName) => {
  // Screen shot
  await page.screenshot({path:`images/${fileName}.png`, fullPage: true});
  console.log("Screenshot OK");
}

const delete_S_to_HTTPS = async (page) => {
  console.log(page.url());
  let httpUrl = page.url();
  httpUrl = httpUrl.replace('https', 'http');
  console.log(httpUrl);
  await page.goto(httpUrl);
}

module.exports.config = config;
module.exports.goHome = goHome;
module.exports.goHomeTest = goHomeTest;
module.exports.login = login;
module.exports.doScreenshot = doScreenshot;
module.exports.delete_S_to_HTTPS = delete_S_to_HTTPS;