import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor'

const getUnits = (sciper: string): string[] => {
  const url = `https://websrv.epfl.ch/cgi-bin/rwsaccred/getRights?app=wp-veritas&caller=000000&password=${Meteor.settings.accred_password}&persid=${sciper}`;
  
  // Note: si on ne précise pas de fonction de callback en 3ème paramètre
  // HTTP GET est synchrone
  let response = HTTP.get(url, {});
  let admin_units: number[] = response.data.result['WordPress.Admin'];
  let editor_units: number[] = response.data.result['WordPress.Editor'];
  let units: number[];
  if (admin_units == undefined && editor_units == undefined) {
    units = [];
  } else if (admin_units == undefined) {
    units = editor_units;
  } else if (editor_units == undefined) {
    units = admin_units;
  } else {
    units = [...admin_units, ...editor_units];
  }
  // Convert Array of Integer to Array of String
  let result: string[] = units.map(String);
  return result;
}

export {
  getUnits
}