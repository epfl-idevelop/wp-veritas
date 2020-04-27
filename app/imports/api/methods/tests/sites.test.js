import assert from "assert";
import { Sites, Tags } from "../../collections";
import { insertSite, updateSite, removeSite } from "../sites";
import { insertTag } from "../tags";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { createUser } from "../../../../tests/helpers";

function createTag(userId, args) {
  const context = { userId }
  insertTag._execute(context, args);
}

if (Meteor.isServer) {
  describe("meteor methods site", function () {
    before(function () {
      resetDatabase();
    });

    it("insert site", () => {
      let userId = createUser();

      const args1 = { 
        name_fr: "Beaujolais",
        name_en: "Beaujolais",
        url_fr: "https://fr.wikipedia.org/wiki/Beaujolais",
        url_en: "https://en.wikipedia.org/wiki/Beaujolais",
        type: "field-of-research",
      };

      const args2 = { 
        name_fr: "Vin nature",
        name_en: "Nature wine",
        url_fr: "https://fr.wikipedia.org/wiki/Vin_naturel",
        url_en: "https://en.wikipedia.org/wiki/Natural_wine",
        type: "field-of-research",
      };

      let tag1 = createTag(userId, args1);
      let tag2 = createTag(userId, args2);

      let tagsNumber = Tags.find({}).count();
      assert.strictEqual(tagsNumber, 2);

      const url = "https://www.epfl.ch/beaujolais/madame-placard";
      const title = "Ma meilleure découverte 2019";

      const context = { userId };
      const args = {
        url: url,
        tagline: "Yvon Métras",
        title: title,
        openshiftEnv: "www",
        category: "GeneralPublic",
        theme: "wp-theme-2018",
        languages: ["en", "fr"],
        unitId: "13030",
        unitName: "IDEV-FSD",
        unitNameLevel2: "SI",
        snowNumber: "42",
        comment: "Vin nature par excellence !",
        createdDate: new Date(),
        userExperience: false,
        userExperienceUniqueLabel: "",
        tags: [tag1, tag2],
        professors: [],
        wpInfra: true,
      };

      insertSite._execute(context, args);

      let sitesNumber = Sites.find({}).count();
      let site = Sites.findOne({ url: url });

      assert.strictEqual(sitesNumber, 1);
      assert.strictEqual(site.title, title);
    });

    it("update site", () => {
      let userId = createUser();
      const url = "https://www.epfl.ch/beaujolais/madame-placard";
      const title = "Ma meilleure découverte 2019";
      let site = Sites.findOne({ url: url });

      const context = { userId };
      const args = {
        _id: site._id,
        url: url,
        tagline: site.tagline,
        title: title,
        openshiftEnv: "www",
        category: "GeneralPublic",
        theme: "wp-theme-2018",
        languages: ["en", "fr"],
        unitId: "13030",
        unitName: "IDEV-FSD",
        unitNameLevel2: "SI",
        snowNumber: "42",
        comment: "Vin nature par excellence !",
        createdDate: new Date(),
        userExperience: false,
        userExperienceUniqueLabel: "",
        tags: [],
        professors: [],
        wpInfra: true,
      };

      updateSite._execute(context, args);

      let nb = Sites.find({}).count();
      let siteAfterUpdate = Sites.findOne({ _id: site._id });

      assert.strictEqual(nb, 1);
      assert.strictEqual(siteAfterUpdate.tagline, "Yvon Métras");
      assert.strictEqual(siteAfterUpdate.title, title);
    });

    it("remove site", () => {
      let userId = createUser();
      const url = "https://www.epfl.ch/beaujolais/madame-placard";
      let site = Sites.findOne({ url: url });

      const context = { userId };
      const args = { siteId: site._id };

      let sitesNumberBeforeRemove = Sites.find({}).count();
      assert.strictEqual(sitesNumberBeforeRemove, 1);

      removeSite._execute(context, args);

      let sitesNumberAfterRemove = Sites.find({}).count();
      assert.strictEqual(sitesNumberAfterRemove, 0);
    });
  });
}