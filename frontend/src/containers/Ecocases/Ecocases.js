import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';
import { showLoginDialog, showRegisterDialog, redirectReplacePath } from 'ducks/application/application';
import { loadEcocases, deleteEcocase } from 'ducks/postings/ecocases';

import { List, Ecocase, ConfirmCheckModal } from 'components';

const radiumStyles = require('theme/RadiumStyles');

const styles = {
  container: {
    marginTop: '1em',
    marginBottom: '1em'
  },

  ecocasesList: {
    margin: 'auto'
  },

  confirmIcon: {
  },

};

const i18n = defineMessages({
  confirmCheckModalHeader: {
    id: 'ecocases.confirmCheckModalHeader',
    defaultMessage: 'Delete Ecocase'
  },

  confirmCheckModalDescription: {
    id: 'ecocases.confirmCheckModalDescription',
    defaultMessage: 'Are you sure you want to delete this ecocase?'
  },

});

const mapStateToProps = createSelector([
  state => state.auth,
  state => state.entities.ecocases,
  (state, props) => {
    const postingsByType = state.postings[props.type];
    if (postingsByType && postingsByType[props.option]) {
      return postingsByType[props.option];
    }
    return { ids: [] };
  }
], (auth, ecocases, ecocasesPagination) => {
  const ecocasesPaginationList = ecocasesPagination.ids.map(id => ecocases[id]);
  return {
    auth,
    ecocasesPagination,
    ecocasesPaginationList
  };
});

@connect(
  mapStateToProps,
  { loadEcocases, deleteEcocase, showLoginDialog }
)
@injectIntl
@Radium
export default class Ecocases extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    auth: PropTypes.object.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    option: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    ecocasesPagination: PropTypes.object.isRequired,
    ecocasesPaginationList: PropTypes.array.isRequired,
    loadEcocases: PropTypes.func.isRequired,
    deleteEcocase: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { showCheckModal: false };
    this.onShowCheckModal = this.onShowCheckModal.bind(this);
    this.onCloseCheckModal = this.onCloseCheckModal.bind(this);
    this.onConfirmCheckModal = this.onConfirmCheckModal.bind(this);
    this._loadEcocases = this._loadEcocases.bind(this);
    this._handleLoadMoreClick = this._handleLoadMoreClick.bind(this);
    this.renderEcocase = this.renderEcocase.bind(this);
  }

  componentWillMount() {
    this._loadEcocases(this.props.type, this.props.option);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.option !== nextProps.option || this.props.type !== nextProps.type) {
      this._loadEcocases(nextProps.type, nextProps.option);
    } else if (!nextProps.ecocasesPagination.isFetching &&
      this.props.ecocasesPagination !== nextProps.ecocasesPagination &&
      !nextProps.ecocasesPagination.pageCount &&
      !nextProps.ecocasesPagination.isFetchFailed) {
      this._loadEcocases(nextProps.type, nextProps.option);
    }
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

  _loadEcocases(type, option, nextPage) {
    this.props.loadEcocases(type, option, nextPage);
  }

  _handleLoadMoreClick() {
    this._loadEcocases(this.props.type, this.props.option, true);
  }

  renderEcocase(ecocase) {
    const { auth, type, option } = this.props;
    if (ecocase.deleted) return null;

    return (
      <div key={type + '-' + option + '-' + ecocase.id} className="ui container"
           style={[radiumStyles.listMargin, radiumStyles.fullWidth]}>
        <Ecocase ecocase={ecocase}
              auth={auth}
              showLoginDialog={this.props.showLoginDialog}
              showConfirmCheckModal={this.onShowCheckModal}/>
      </div>
    );
  }

  render() {
    const { ecocasesPagination, ecocasesPaginationList,
      intl: { formatMessage } } = this.props;

    const confirmCheckModalIconCom = (
      <i className="remove circle outline icon" style={styles.confirmIcon} />
    );

    return (
      <div className="ecocases ui container">
        <List className="one cards"
              renderItem={this.renderEcocase}
              items={ecocasesPaginationList}
              onLoadMoreClick={this._handleLoadMoreClick}
              {...ecocasesPagination} />
        <ConfirmCheckModal key="ecocases-ecocase-delete-confirm-check-modal"
                           id="ecocases-ecocase-delete-confirm-check-modal"
                           showOn={this.state.showCheckModal}
                           header={formatMessage(i18n.confirmCheckModalHeader)}
                           description={formatMessage(i18n.confirmCheckModalDescription)}
                           iconDom={confirmCheckModalIconCom}
                           onClose={this.onCloseCheckModal}
                           onConfirm={this.onConfirmCheckModal}/>
      </div>
    );
  }
}
