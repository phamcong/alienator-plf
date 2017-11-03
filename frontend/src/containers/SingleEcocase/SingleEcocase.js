import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';

import $ from 'jquery';
import classNames from 'classnames';
import { shortenString } from 'utils/handleString';

import { COMMENTS_BY_ECOCASE } from 'ducks/postings';
import { showLoginDialog } from 'ducks/application/application';
import { fetchEcocase, deleteEcocase } from 'ducks/postings/ecocases';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import { Comments, CommentComposer } from 'containers';
import { List, Ecocase, ConfirmCheckModal } from 'components';

const radiumStyles = require('theme/RadiumStyles');

const styles = {
  confirmIcon: {
    width: '5rem'
  },

  loader: {
    marginTop: '3rem'
  },

  zIndexUp: {
    zIndex: 3
  },

  commentsCardContainer: {
    top: '-24px',
    margin: 'auto',
    maxWidth: '490px',
    width: '100%',
    background: '#F5F5F5',
    padding: '1.2em 1em 2em 1em',
  }
};

const i18n = defineMessages({
  confirmCheckModalHeader: {
    id: 'singleEcocase.confirmCheckModalHeader',
    defaultMessage: 'Delete Ecocase'
  },

  confirmCheckModalDescription: {
    id: 'singleEcocase.confirmCheckModalDescription',
    defaultMessage: 'Are you sure you want to delete this ecocase?'
  },

  nothingHere: {
    id: 'singleEcocase.nothingHere',
    defaultMessage: 'Nothing here'
  },

  loading: {
    id: 'singleEcocase.loading',
    defaultMessage: 'Loading..'
  },

  nothing: {
    id: 'singleEcocase.nothing',
    defaultMessage: 'Nothing here!'
  }

});

const mapStateToProps = createSelector([
  state => state.auth,
  state => state.application.isShowModal,
  state => state.entities.ecocases,
  (state, props) => props.params
], (auth, isShowModal, ecocases, params) => {
  const ecocase = params && ecocases[params.ecocaseId] ? ecocases[params.ecocaseId] : null;
  return { auth, isShowModal, ecocase };
});

@connect(
  mapStateToProps,
  { fetchEcocase, deleteEcocase, showLoginDialog }
)
@injectIntl
@Radium
export default class SingleEcocase extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    auth: PropTypes.object.isRequired,
    isShowModal: PropTypes.bool.isRequired,
    ecocase: PropTypes.object,
    params: PropTypes.object.isRequired,
    showLoginDialog: PropTypes.func.isRequired,

    fetchEcocase: PropTypes.func.isRequired,
    deleteEcocase: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isFetching: false,
      showCheckModal: false
    };
    this.onShowCheckModal = this.onShowCheckModal.bind(this);
    this.onCloseCheckModal = this.onCloseCheckModal.bind(this);
    this.onConfirmCheckModal = this.onConfirmCheckModal.bind(this);
    this.loadEcocase = this.loadEcocase.bind(this);
    this.renderEcocase = this.renderEcocase.bind(this);
  }

  componentWillMount() {
    this.loadEcocase(this.props.params.ecocaseId);
  }

  onShowCheckModal(checkedEcocaseId) {
    this.setState({
      showCheckModal: true,
      checkedEcocaseId
    });
  }

  onCloseCheckModal() {
    this.setState({
      showCheckModal: false,
      checkedEcocaseId: null
    });
  }

  onConfirmCheckModal() {
    const deleteEcocaseId = this.state.checkedEcocaseId;
    this.props.deleteEcocase(deleteEcocaseId);
  }

  onFocusInput() {
    $('input').focus();
  }

  loadEcocase(ecocaseId) {
    const loadEcocasePromise = this.props.fetchEcocase(ecocaseId);
    if (loadEcocasePromise) {
      this.setState({ isFetching: true });
      loadEcocasePromise
        .then((response) => {
          this.setState({ isFetching: false });
        })
        .catch((error) => {
          this.setState({ isFetching: false });
        })
      ;
    }
  }

  renderEcocase(ecocase) {
    const { auth } = this.props;

    return (
      <Ecocase key={ecocase.id}
            style={styles.zIndexUp}
            ecocase={ecocase}
            auth={auth}
            disabledSelfLink
            showLoginDialog={this.props.showLoginDialog}
            showConfirmCheckModal={this.onShowCheckModal}
            onCommentsButton={this.onFocusInput}/>
    );
  }

  render() {
    const { ecocase, auth, intl: { formatMessage }, isShowModal } = this.props;
    const { isFetching } = this.state;

    const ecocaseTitle = ecocase && !ecocase.deleted ? ecocase.title :
      isFetching ? formatMessage(i18n.loading) : formatMessage(i18n.nothingHere);

    let tempDom;
    const isEmpty = !ecocase || ecocase.deleted;
    if (isFetching && isEmpty) {
      tempDom = (<div className="ui active centered inline loader" style={styles.loader}></div>);
    }
    if (!isFetching && isEmpty) {
      tempDom = (<h3 style={radiumStyles.center}><i className="frown icon" />{formatMessage(i18n.nothing)}</h3>);
    }

    const confirmCheckModalIconCom = (
      <i className="remove circle outline icon" style={styles.confirmIcon} />
    );

    const ecocaseDom = ecocase ? (
      <div id="capture-and-fire">
        {this.renderEcocase(ecocase)}
        <div className="comment-list ui card" style={styles.commentsCardContainer}>
          <CommentComposer ecocaseId={ecocase.id} auth={auth} style={styles.commentComposer} loadEcocase={this.loadEcocase}/>
          <Comments type={COMMENTS_BY_ECOCASE} option={ecocase.id} />
        </div>
        <ConfirmCheckModal key="singleecocase-delete-confirm-check-modal"
                           id="singleecocase-delete-confirm-check-modal"
                           showOn={this.state.showCheckModal}
                           header={formatMessage(i18n.confirmCheckModalHeader)}
                           description={formatMessage(i18n.confirmCheckModalDescription)}
                           iconDom={confirmCheckModalIconCom}
                           onClose={this.onCloseCheckModal}
                           onConfirm={this.onConfirmCheckModal}/>
      </div>
    ) : null;

    return (
      <div className={classNames('single-ecocase ui text container',
       (isShowModal ? 'modal-container' : 'main-container'))}>
        <Helmet title={shortenString(ecocaseTitle, 17)}/>
        {isEmpty ? tempDom : ecocaseDom}
      </div>
    );
  }
}
