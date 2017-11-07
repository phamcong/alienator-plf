import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import _ from 'lodash';
import { throttle } from 'lodash-decorators';
import $ from 'jquery';
import classNames from 'classnames';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reduxForm } from 'redux-form';

//Do not connect this action
import { submitEcocase, insertEcocaseToEcocasesPagination } from 'ducks/postings/ecocases';
import { showDelayedToastMessage } from 'ducks/messages/toastMessage';
import toastMessages from 'i18nDefault/toastMessages';

import { addhttp } from 'utils/transformUrl';
import { checkEnter } from 'utils/handleKeyPress';
import ecocaseValidation from './ecocaseValidation';

import { showLoginDialog } from 'ducks/application/application';

const i18n = defineMessages({
  titlePlaceHolder: {
    id: 'ecocaseComposer.titlePlaceHolder',
    defaultMessage: 'Title'
  },

  linkPlaceHolder: {
    id: 'ecocaseComposer.linkPlaceHolder',
    defaultMessage: 'Type or paste URL'
  },

  promisePlaceHolder: {
    id: 'ecocaseComposer.promisePlaceHolder',
    defaultMessage: 'Promise'
  },

  button: {
    id: 'ecocaseComposer.button',
    defaultMessage: 'Create'
  },

  loginButton: {
    id: 'ecocaseComposer.loginButton',
    defaultMessage: 'Login first'
  },

});

const styles = require('./EcocaseComposerStyles');

@connect(
  null,
  { showLoginDialog }
)
@reduxForm({
  form: 'ecocase',
  fields: ['title', 'promise', 'usage', 'organization'],
  validate: ecocaseValidation
})
@injectIntl
@Radium
export default class EcocaseComposer extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    style: PropTypes.object,
    intl: intlShape.isRequired,
    showLoginDialog: PropTypes.func.isRequired,

    fields: PropTypes.object.isRequired,
    error: PropTypes.string,
    errors: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { changed: false };
    this._submitEcocase = this._submitEcocase.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._checkUrl = this._checkUrl.bind(this);
    this._enterKeyEvent = this._enterKeyEvent.bind(this);
    this._resetForm = this._resetForm.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.loggedIn) {
      $('.ecocase-composer-card').dimmer({
        on: 'hover'
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.values, nextProps.values) && !this.state.changed && nextProps.dirty) {
      this.setState({ changed: true });
    }
  }

  componentDidUpdate(prevProps) {
    //Show up general error message
    if (!prevProps.error && this.props.error && !$('#ecocase-composer-general-error-message').transition('is visible')) {
      $('#ecocase-composer-general-error-message')
        .transition('fade up');
    }
    //Hide general error message
    if (!_.isEqual(prevProps.values, this.props.values) && this.props.error) {
      $('#ecocase-composer-general-error-message')
        .transition({
          animation: 'fade up',
          onHide: () => {
            this.props.initializeForm();
          },
          queue: false
        });
    }

    //Show up title Field error message
    if (this.props.fields.title.dirty && this.props.errors.title && !$('.ui.title.label').transition('is visible')) {
      $('.ui.title.pointing.label')
        .transition('fade up');
    }
    //Hide title Field error message
    if (prevProps.errors.title && !this.props.errors.title && $('.ui.title.label').transition('is visible')) {
      $('.ui.title.pointing.label')
        .transition('hide');
    }

    // //Show up link Field error message
    // if (this.props.fields.link.dirty && this.props.errors.link && !$('.ui.link.label').transition('is visible')) {
    //   $('.ui.link.pointing.label')
    //     .transition('fade up');
    // }
    // //Hide link Field error message
    // if (prevProps.errors.link && !this.props.errors.link && $('.ui.link.label').transition('is visible')) {
    //   $('.ui.link.pointing.label')
    //     .transition('hide');
    // }
  }

  @throttle(1000)
  _submitEcocase(values, dispatch) {
    this.props.initializeForm();
    return new Promise((resolve, reject) => {
      dispatch(
        submitEcocase(values)
      ).then((response) => {
        const responseTitle = response.entities.ecocases[response.result].title;
        this._resetForm();
        dispatch(showDelayedToastMessage({
          type: 'success',
          title: toastMessages.submitEcocaseTitle,
          body: Object.assign(toastMessages.submitEcocaseBody, { values:
          { ecocaseTitle: responseTitle } })
        }, 300));
        dispatch(insertEcocaseToEcocasesPagination(response.result));
        resolve(response);
      }).catch((error) => {
        if (error.errors) {
          const errors = {};
          if (error.errors.title) errors.title = error.errors.title[0];
          if (error.errors.promise) errors.promise = error.errors.promise[0];
          if (error.errors.usage) errors.usage = error.errors.usage[0];
          if (error.errors.organization) errors.organization = error.errors.organization[0];
          if (error.message) errors._error = error.message;
          reject(errors);
        }
      });
    });
  }

  _onSubmit(values, dispatch) {
    return this._submitEcocase(values, dispatch);
  }

  _checkUrl() {
    if (this.props.fields.link.value) {
      this.props.fields.link.onChange(addhttp(this.props.fields.link.value));
    }
  }

  _enterKeyEvent(event) {
    if (checkEnter(event)) {
      this._checkUrl();
    }
  }

  _resetForm() {
    this.props.resetForm();
    this.setState({ changed: false });
  }

  render() {
    const { auth, style, intl: { formatMessage }, error, errors, fields: { title, promise, usage, organization }, handleSubmit, invalid,
      submitting } = this.props;
    const { changed } = this.state;

    const recommendLogin = (
      <div className="ui green basic button" onClick={this.props.showLoginDialog} type="button">
        {formatMessage(i18n.loginButton)}
      </div>
    );

    return (
      <div className="ecocase-composer ui container" style={[style]} >
        <form className={classNames('ui form content', { 'error': (invalid && changed) })} onSubmit={handleSubmit(this._onSubmit)}>
          <div className="ecocase-composer-card ui centered card" style={styles.card}>
            <div className="ui inverted dimmer">
              <div className="content">
                <div className="center">
                  {recommendLogin}
                </div>
              </div>
            </div>

            <div className="content" style={styles.mainContent}>
              <div className={classNames('field', { 'error': (title && title.invalid && changed) })} style={styles.titleField}>
                <div className="ui form">
                  <div className="field">
                    <label>Title</label>
                    <input type="text" rows="2" name="title" ref="title" {...title} style={styles.titleInput}/>
                  </div>
                </div>
                <div className="ui title pointing red basic small label transition hidden" style={styles.errorText}>
                  { errors.title && errors.title.id ? <FormattedMessage {...errors.title} /> : errors.title ? errors.title : null }
                </div>
              </div>

              <div className={classNames('field', { 'error': (promise && promise.invalid && changed) })} style={styles.promiseField}>
                <div className="ui form">
                  <div className="field">
                    <label>Promise</label>
                    <textarea rows="2" name="promise" ref="promise" {...promise} style={styles.promiseInput}></textarea>
                  </div>
                </div>
                <div className="ui title pointing red basic small label transition hidden" style={styles.errorText}>
                  { errors.promise && errors.promise.id ? <FormattedMessage {...errors.promise} /> : errors.promise ? errors.promise : null }
                </div>
              </div>

              <div className={classNames('field', { 'error': (usage && usage.invalid && changed) })} style={styles.usageField}>
                <div className="ui form">
                  <div className="field">
                    <label>Usage</label>
                    <textarea rows="2" name="usage" ref="usage" {...usage} style={styles.usageInput}></textarea>
                  </div>
                </div>
                <div className="ui title pointing red basic small label transition hidden" style={styles.errorText}>
                  { errors.usage && errors.usage.id ? <FormattedMessage {...errors.usage} /> : errors.usage ? errors.usage : null }
                </div>
              </div>

              <div className={classNames('field', { 'error': (organization && organization.invalid && changed) })} style={styles.organizationField}>
                <div className="ui form">
                  <div className="field">
                    <label>Organization</label>
                    <textarea rows="2" name="organization" ref="organization" {...organization} style={styles.organizationInput}></textarea>
                  </div>
                </div>
                <div className="ui title pointing red basic small label transition hidden" style={styles.errorText}>
                  { errors.organization && errors.organization.id ? <FormattedMessage {...errors.organization} /> : errors.organization ? errors.organization : null }
                </div>
              </div>
            </div>

            <button type="submit" className={classNames('ui attached bottom blue button', { 'loading': submitting })}
                    disabled={submitting || invalid} >
              <i className="add icon" />
              <FormattedMessage {...i18n.button} />
            </button>
          </div>
          <div id="ecocase-composer-general-error-message"
               className="ui general error message hidden" style={styles.errorText}>
            {error}
          </div>
        </form>
      </div>
    );

  }
}
