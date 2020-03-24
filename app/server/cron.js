import { Sites, Professors } from '../imports/api/collections';

SyncedCron.add({
  name: 'Update professors name',
  schedule: function(parser) {
    return parser.text('every 2 minutes');
  },
  job: function(intendedAt) {
    console.log("Update professors ...");

    const publicLdapContext = require('epfl-ldap')();
    
    let professors = Professors.find({}).fetch();
    professors.forEach(prof => {
      publicLdapContext.users.getUserBySciper(prof.sciper, function(err, user) {

        console.log("Sciper: ", user.sciper);
        console.log("Display name: ", user.displayName);
        
        let professorDocument = {
          displayName: user.displayName,
        }
        Professors.update(
          { _id: prof._id }, 
          { $set: professorDocument }
        );
        
      })
    });
    console.log('All professors updated:', intendedAt);
  }
});

/*
SyncedCron.add({
  name: 'Update unit names',
  schedule: function(parser) {
    // Note: epfl-ldap-js cache is 4 hours
    // Charles François said, "Changes in unit structure are currently only made once a night."
    return parser.text('every 24 hours');
  },
  job: function(intendedAt) {
    console.log("Update unitName and unitNameLevel2 of each site starting ...");
    
    const fullLdapContext = require('epfl-ldap')();
    fullLdapContext.options.modelsMapper = fullLdapContext.viewModelsMappers.full;

    // Update all sites
    let sites = Sites.find({}).fetch();
    sites.forEach(site => {

      fullLdapContext.units.getUnitByUniqueIdentifier(site.unitId, function(err, unit) {

        let unitName = '';
        let unitNameLevel2 = '';

        if ('cn' in unit) {
          unitName = unit.cn;
        }
        if ('dn' in unit) {
          let dn = unit.dn.split(",");
          if (dn.length == 5) {
            // dn[2] = 'ou=associations'
            unitNameLevel2 = dn[2].split("=")[1];
          }
        }

        Sites.update(
          { _id: site._id },
          { $set: {
          'unitName': unitName,
          'unitNameLevel2': unitNameLevel2
          }},
        );

        let newSite = Sites.findOne(site._id);
        console.log(`Site: ${newSite.url} after update => unitName: ${newSite.unitName} UnitNameLevel2: ${newSite.unitNameLevel2}`);
        
      });
    });
    console.log('All sites updated:', intendedAt);
  }
});
*/