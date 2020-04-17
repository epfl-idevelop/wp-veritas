import React, { Component, Fragment } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Formik, Field, ErrorMessage } from "formik";
import { Professors } from "../../../api/collections";
import { CustomError, CustomInput } from "../CustomFields";
import { Link } from "react-router-dom";
import { AlertSuccess, Loading } from "../Messages";
import { insertProfessor, removeProfessor } from "../../../api/methods/professors";

class ProfessorsList extends Component {
  render() {
    return (
      <div className="card my-2">
        <h5 className="card-header">Liste des professeurs</h5>
        <ul className="list-group">
          {this.props.professors.map((professor, index) => (
            <li
              id={"sciper-" + professor.sciper}
              key={professor._id}
              className="list-group-item"
            >
              {professor.sciper}&nbsp;
              {professor.displayName}
              <button type="button" className="close" aria-label="Close">
                <span
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you wish to delete this item?"
                      )
                    )
                      this.props.callBackDeleteProfessor(professor._id);
                  }}
                  aria-hidden="true"
                >
                  &times;
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class Professor extends Component {
  constructor(props) {
    super(props);

    let action;
    if (this.props.match.path == "/professor/:_id/edit") {
      action = "edit";
    } else {
      action = "add";
    }

    this.state = {
      action: action,
      addSuccess: false,
      editSuccess: false,
      deleteSuccess: false,
    };
  }

  deleteProfessor = (professorId) => {
    removeProfessor.call({ professorId }, (error, professorID) => {
      if (error) {
        console.log(`ERROR Professor removeProfessor ${error}`);
      } else {
        this.setState({ deleteSuccess: true });
      }
    });
  };

  updateUserMsg = () => {
    this.setState({
      addSuccess: false,
      editSuccess: false,
      deleteSuccess: false,
    });
  };

  submitProfessor = async (values, actions) => {
    let state;
    const getUserFromLDAPPromise = (method, values) => {
      return new Promise((resolve, reject) => {
        Meteor.call(method, values, (error, result) => {
          if (error) {
            console.log(`ERROR ${error}`);
          } else {
            resolve(result);
          }
        });
      });
    };
    const insertProfessorPromise = (values) => {
      return new Promise((resolve, reject) => {
        insertProfessor.call(values, (errors, result) => {
          if (errors) {
            console.log(errors);
            let formErrors = {};
            errors.details.forEach(function (error) {
              formErrors[error.name] = error.message;
            });
            actions.setErrors(formErrors);
            actions.setSubmitting(false);
          } else {
            actions.setSubmitting(false);
            actions.resetForm();
            this.setState({
              addSuccess: true,
              editSuccess: false,
              deleteSuccess: false,
              action: "add",
            });
          }
        });
      });
    };
    const ldapInfo = await getUserFromLDAPPromise(
      "getUserFromLDAP",
      values.sciper
    );
    let infos = {
      sciper: ldapInfo.sciper,
      displayName: ldapInfo.displayName,
    };
    const insert = await insertProfessorPromise(infos);
  };

  getProfessor = () => {
    // Get the URL parameter
    let professorId = this.props.match.params._id;
    let professor = Professors.findOne({ _id: professorId });
    return professor;
  };

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == "add") {
      initialValues = { sciper: "" };
    } else {
      initialValues = this.getProfessor();
    }
    return initialValues;
  };

  render() {
    let content;
    let initialValues = this.getInitialValues();
    let isLoading =
      this.props.professors == undefined || initialValues == undefined;

    if (isLoading) {
      content = <Loading />;
    } else {
      content = (
        <Fragment>
          <div className="card">
            <h5 className="card-header">Ajouter un professeur</h5>
            {this.state.addSuccess ? (
              <AlertSuccess
                message={"Le nouveau professeur a été ajouté avec succès !"}
              />
            ) : null}
            {this.state.deleteSuccess ? (
              <AlertSuccess
                message={"Le professeur a été supprimé avec succès !"}
              />
            ) : null}
            <Formik
              onSubmit={this.submitProfessor}
              initialValues={initialValues}
              validateOnBlur={false}
              validateOnChange={false}
            >
              {({ handleSubmit, isSubmitting, handleChange, handleBlur }) => (
                <form onSubmit={handleSubmit}>
                  <Field
                    onChange={(e) => {
                      handleChange(e);
                      this.updateUserMsg();
                    }}
                    onBlur={(e) => {
                      handleBlur(e);
                      this.updateUserMsg();
                    }}
                    placeholder="Sciper du professeur"
                    name="sciper"
                    type="text"
                    component={CustomInput}
                  />
                  <ErrorMessage name="sciper" component={CustomError} />

                  <div className="my-1 text-right">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>

          {this.state.deleteSuccess ? (
            <AlertSuccess
              message={"Le professeur a été supprimé avec succès !"}
            />
          ) : null}

          <ProfessorsList
            professors={this.props.professors}
            callBackDeleteProfessor={this.deleteProfessor}
          />
        </Fragment>
      );
    }
    return content;
  }
}
export default withTracker(() => {
  Meteor.subscribe("professor.list");
  return {
    professors: Professors.find({}, { sort: { displayName: 1 } }).fetch(),
  };
})(Professor);
