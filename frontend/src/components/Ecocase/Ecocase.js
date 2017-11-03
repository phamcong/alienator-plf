import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import $ from 'jquery';
import moment from 'moment';
import { shortenString } from 'utils/handleString';
import { checkAuth } from 'helpers/authChecker';
import { getHostPathFromUrl } from 'utils/transformUrl';
import classNames from 'classnames';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';

import { Link as LinkComponent } from 'react-router';
const Link = Radium(LinkComponent);
import { UpvoteButton } from 'components';

import { upvoteEcocase, cancelUpvoteEcocase } from 'ducks/postings/ecocases';

const styles = require('./EcocaseStyles');

const i18n = defineMessages({
  comments: {
    id: 'comp.ecocase.comments',
    defaultMessage: '{commentCount, plural, =0 {no comment} =1 {one comment} other {# comments}}'
  },
  deleteEcocase: {
    id: 'comp.ecocase.deleteEcocase',
    defaultMessage: 'delete'
  },
});

@connect(
  null,
  { upvoteEcocase, cancelUpvoteEcocase }
)
@injectIntl
@Radium
export default class Ecocase extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    auth: PropTypes.object.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    showConfirmCheckModal: PropTypes.func.isRequired,
    onCommentsButton: PropTypes.func,
    disabledSelfLink: PropTypes.bool,

    ecocase: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,

    upvoteEcocase: PropTypes.func.isRequired,
    cancelUpvoteEcocase: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.checkAndUpvoteEcocase = this.checkAndUpvoteEcocase.bind(this);
    this.checkAndCancelUpvoteEcocase = this.checkAndCancelUpvoteEcocase.bind(this);
    this.deleteEcocase = this.deleteEcocase.bind(this);
  }

  checkAndUpvoteEcocase(ecocaseId) {
    if (!checkAuth(this.props.auth, this.props.showLoginDialog)) {
      return Promise.resolve('Login first');
    }
    return this.props.upvoteEcocase(ecocaseId);
  }

  checkAndCancelUpvoteEcocase(ecocaseId) {
    if (!checkAuth(this.props.auth, this.props.showLoginDialog)) {
      return Promise.resolve('Login first');
    }
    return this.props.cancelUpvoteEcocase(ecocaseId);
  }

  deleteEcocase(event) {
    event.preventDefault();
    this.props.showConfirmCheckModal(this.props.ecocase.id);
  }

  render() {
    const { ecocase, intl: { formatMessage, locale }, style, disabledSelfLink } = this.props;
    const ecocaseLink = getHostPathFromUrl(ecocase.link);

    const meLabel = (
      <div className="ui top right attached animated fade button label" type="button"
           onClick={this.deleteEcocase} style={styles.meLabel}>
        <span className="visible content" style={styles.meLabelContent}>
          Me
        </span>
        <span className="hidden content" style={styles.meLabelHiddenContent}>
          {formatMessage(i18n.deleteEcocase)}
        </span>
        <i className="delete icon" style={styles.deleteIcon} />
      </div>
    );

    const singleEcocaseLocation = {
      pathname: '/ecocase/' + ecocase.id,
      state: { modal: true }
    };

    return (
      <div className="ui centered card" style={[styles.card, style]}>
        <Link className="content" to={singleEcocaseLocation} style={styles.cardHeader} disabled={disabledSelfLink}>
          {ecocase.isAuthorMe ? meLabel : null}
          <div className="header" style={styles.title}>
            {shortenString(ecocase.title, 44)}
            {ecocase.title.length > 44 ? (<span className="after-gradient-effect" />) : null}
          </div>
        </Link>
        <div className="content" style={styles.mainContent}>
          <div className="link-button ui center aligned container" style={styles.linkButtonContainer}>
            <a className="ui labeled icon blue basic button"
               href={ecocase.link} target="_blank" style={styles.linkButton}>
              <i className="linkify icon" />
              {shortenString(ecocaseLink, 29)}
              {ecocaseLink.length > 29 ? (<span className="after-gradient-effect" />) : null}
            </a>
          </div>
          <Link className="user" to={'/user/' + ecocase.author.id}>
            <i className="user circular inverted blue user small icon" />
            {shortenString(ecocase.author.username, 13)}
          </Link>
          <div className="meta date" style={styles.meta}>
            {moment(ecocase.createdAt).locale(locale).fromNow()}
          </div>
        </div>
        <div className="extra-infos extra content" style={styles.extraInfos}>
          <UpvoteButton
            node={ecocase}
            onUpvoteClick={this.checkAndUpvoteEcocase}
            onCancelUpvoteClick={this.checkAndCancelUpvoteEcocase} />
          &nbsp;&nbsp;
          <Link className="right floated comment-info" to={singleEcocaseLocation}
                onClick={this.props.onCommentsButton} disabled={disabledSelfLink}>
            <i className="comment icon" />
            <FormattedMessage {...i18n.comments} values={{ commentCount: ecocase.commentCount }}/>
          </Link>
        </div>
      </div>
    );
  }
}
