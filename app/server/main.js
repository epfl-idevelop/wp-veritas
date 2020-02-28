import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import '../imports/api/methods'; // Call meteor methods backend
import './publications'; // Call meteor publications backend
import { importData } from './import-data';
import { removeAllCollections } from './removeAllCollections';
import { AppLogger } from './logger';
import './indexes';
import { Sites } from '../imports/api/collections';

// Define lang <html lang="fr" />
WebApp.addHtmlAttributeHook(() => ({ lang: 'fr' }));

let importDatas = false;
  
if (Meteor.isServer) {
  import './tequila-config';
  import './rest-api';

  // Setting up logs
  new AppLogger();

  if (importDatas) {
    //removeAllCollections();
    importData();
  }

  SyncedCron.config({
    collectionName: 'somethingDifferent'
  });

  SyncedCron.add({
    name: 'Update unit names',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 1 minutes');
    },
    job: function(intendedAt) {

      // Update all sites
      let sites = Sites.find({}).fetch();
      sites.forEach(site => {

        let unit = Meteor.apply('getUnitFromLDAP', [site.unitId], true);
        let unitName = site.unitName;
        let unitNameLevel2 = site.unitNameLevel2;

        if ('cn' in unit) {
          unitName = unit.cn;
        }
        if ('dn' in unit) {
          let dn = unit.dn.split(",");
          if (dn.length == 5) {
            unitNameLevel2 = dn[2];
          }
        }

        Sites.update(
          { _id: site._id },
          { $set: { 'unitName' : unitName, 'unitNameLevel2': unitNameLevel2} },
        );
        let newSite = Sites.findOne(site._id);
        console.log('Site after update:', newSite);

      });
      console.log('All sites updated:', intendedAt);
    }
  });

  Meteor.startup(function () {
    // code to run on server at startup
    SyncedCron.start();
  });
}
