import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
import MessageBox from 'message-box';
import { sitesSchema } from './schemas/sitesSchema';
import { sitesWPInfraOutsideSchema } from './schemas/sitesWPInfraOutsideSchema';
import { isRequired, isRequiredUnderCondition } from './schemas/utils';

SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});

const messageBox = new MessageBox({
    messages: {
        fr: {
          required: 'Le champ "{{label}}" est obligatoire',
          minString: 'Le champ "{{label}}" doit contenir au moins {{min}} caractères',
          maxString: 'Le champ "{{label}}" ne peut pas avoir plus de {{max}} caractères',
          minNumber: 'Le champ "{{label}}" a pour valeur minimale {{min}}',
          maxNumber: 'Le champ "{{label}}" a pour valeur maximale {{max}}',
          minNumberExclusive: 'Le champ "{{label}}" doit être plus supérieur à {{min}}',
          maxNumberExclusive: 'Le champ "{{label}}" doit être plus inférieur à {{max}}',
          minDate: 'Le champ "{{label}}" doit être le ou après le {{min}}',
          maxDate: 'Le champ "{{label}}" ne peut pas être après le {{max}}',
          badDate: 'Le champ "{{label}}" n\'est pas une date valide',
          minCount: 'Vous devez spécifier au moins {{minCount}}} valeurs',
          maxCount: 'Vous ne pouvez pas spécifier plus de {{maxCount}}} valeurs',
          noDecimal: 'Ce champ doit être un entier',
          notAllowed: 'Ce champ n\'a pas une valeur autorisée',
          expectedType: '{{label}} doit être de type {{dataType}}',
          regEx({ label, regExp }) {
            switch (regExp) {
                case (SimpleSchema.RegEx.Url.toString()):
                return "Cette URL est invalide";
            }
        },
        keyNotInSchema: '{{name}} n\'est pas autorisé par le schéma',
        },
      },
    tracker: Tracker,
  });

messageBox.setLanguage('fr');

export const openshiftEnvsSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nom de l environnement openshift",
        custom: isRequired,
    }
}, { tracker: Tracker } );

openshiftEnvsSchema.messageBox = messageBox;

export const typesSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nom du type",
        custom: isRequired,
    }
}, { check });

typesSchema.messageBox = messageBox;

export const categoriesSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nom de la catégorie",
        custom: isRequired,
    }
}, { check });

categoriesSchema.messageBox = messageBox;

export const themesSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nom du thème",
        custom: isRequired,
    }
}, { check });

themesSchema.messageBox = messageBox;

export const professorSchema = new SimpleSchema({
  // _id use to update a tag
  _id: {
    type: String,
    optional: true,
  },
  sciper: {
    type: String,
    label: "Sciper",
    custom: isRequired,
  },
  displayName: {
    type: String,
    label: "DisplayName",
    optional: false,
  }
}, { tracker: Tracker } )

export const tagSchema = new SimpleSchema({
    // _id use to update a tag
    _id: {
        type: String,
        optional: true,
    },
    name_fr: {
        type: String,
        label: "Nom du tag fr",
        custom: isRequired,
    },
    name_en: {
        type: String,
        label: "Nom du tag en",
        custom: isRequired,
    },
    url_fr: {
        type: String,
        label: "URL du tag en français",
        custom: isRequiredUnderCondition,
    },
    url_en: {
        type: String,
        label: "URL du tag en anglais",
        custom: isRequiredUnderCondition,
    },
    type: {
        type: String,
        label: "Type de tag",
        allowedValues: ['faculty', 'institute', 'field-of-research'],
    }
}, { tracker: Tracker } )

sitesSchema.messageBox = messageBox;
sitesWPInfraOutsideSchema.messageBox = messageBox;
tagSchema.messageBox = messageBox;
professorSchema.messageBox = messageBox;

class Site {
    
  constructor(doc) {
        _.extend(this, doc);
    }

    getWpInfra() {
      if (this.wpInfra) {
        return 'Oui';
      } else {
        return 'Non';
      }
    }
}

export const Sites = new Mongo.Collection('sites', {
    transform: (doc) => new Site(doc)
});

/**
 * Search for a specific text, or a list of tags, for element with at least a tag. Sort by title
 * @param {string=} text to search, approximatively (regex wide search, insensitive)
 * @param {array=} lookup for this tag entries, precisely (regex specific search, insensitive)
 */
/*
Sites.tagged_search = function (text="", tags=[]) {
    // build the query
    let finder = {
        $and : [
            { $or : [ { status : "created" }, { status : "no-wordpress" } ] },
        ]
    };

    finder['$and'].push({
        "tags": { $exists: true, $ne: [] }
    });

    if (tags !== undefined && tags.length != 0) {
        let regex_search = [];
        tags.forEach(function(tag){
            regex_search.push(  new RegExp("^" + tag + "$", "i") );
        });

        finder['$and'].push({
            $or: [
                {
                    "tags.name_en": { $all: regex_search}
                },
                {
                    "tags.name_fr": { $all: regex_search}
                }
            ]
        });
    }

    if (text !== undefined && text != "") {
        // start a regex search, so we have a better and
        // precise results at the end
        regex_text = text;
        regex_options = "i";

        finder['$and'].push({
            $or: [
                {
                    "tags.name_en": { $regex: regex_text, $options: regex_options}
                },
                {
                    "tags.name_fr": { $regex: regex_text, $options: regex_options}
                },
                {
                    "url": { $regex: regex_text, $options: regex_options}
                },
                {
                    "title": { $regex: regex_text, $options: regex_options}
                },
                {
                    "tagline": { $regex: regex_text, $options: regex_options}
                }
            ]
        });
    }

    return Sites.find(finder,
        {
            sort: {
                title: 1
            }
        }
    ).fetch();
}*/

export const OpenshiftEnvs = new Mongo.Collection('openshiftenvs');
export const Types = new Mongo.Collection('types');
export const Categories = new Mongo.Collection('categories');
export const Themes = new Mongo.Collection('themes');
export const Tags = new Mongo.Collection('tags');
export const Professors = new Mongo.Collection('professors');
export const AppLogs = new Mongo.Collection('AppLogs');
