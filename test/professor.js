const utils = require('./utils');

const goProfessorsPage = async (page) => {
  // Go on tags page
  await page.$eval('a[href="/professors"]', e => e.click());
  await page.waitFor(500);
  console.log("Go on professor page OK");
}

const addProfessor = async (page) => {
  // Fill form
  await page.type('input[name="sciper"]', '188475');
  
  // Submit Form
  const submitButton = await page.$('button[type="submit"]');
  await submitButton.click('#search-button');
  
  await page.waitFor(2000);
  console.log("Add new professor OK");
}

const checkProfessor = async (page) => {
  const exist = await page.$('#sciper-188475');
  if (exist != null) {
    console.log(`Professor sciper 188475 exist`);
  } else {
    console.error(`Professor sciper 188475 doesn't exist`);
  }
}

const deleteProfessor = async (page) => {
  await page.$eval('#sciper-188475 > button', e => e.click());
  await page.waitFor(3000);
  await utils.doScreenshot(page, 'deleteProftest');
  await page.on('dialog', async dialog => {
    console.log(dialog.accept());
  });
  console.log("Delete professor OK");
  await page.waitFor(1000);
}

const updateProfessorsLDAPInfo = async (page) => {
  await page.$eval('#updateLDAPButton', e => e.click());
  await page.waitFor(3000);
  console.log("Update professor OK");
}

module.exports.goProfessorsPage = goProfessorsPage;
module.exports.addProfessor = addProfessor;
module.exports.deleteProfessor = deleteProfessor;
module.exports.updateProfessorsLDAPInfo = updateProfessorsLDAPInfo;
module.exports.checkProfessor = checkProfessor;