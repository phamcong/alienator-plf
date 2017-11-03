const debug = require('utils/getDebugger')('ecocases');
import { updateEntity } from 'ducks/globalActions';
import { showDelayedToastMessage } from 'ducks/messages/toastMessage';
import toastMessages from 'i18nDefault/toastMessages';
import Schemas from 'ducks/Schemas';
import { ECOCASES_BY_SORTING_OPTION, ECOCASES_BY_ACCOUNT } from 'ducks/postings';

/********************************
            get ecocase
 ********************************/
const ECOCASE_REQUEST = 'ecocases/ecocases/ECOCASE_REQUEST';
const ECOCASE_SUCCESS = 'ecocases/ecocases/ECOCASE_SUCCESS';
const ECOCASE_FAILURE = 'ecocases/ecocases/ECOCASE_FAILURE';

export const ECOCASE_ARRAY = [
  ECOCASE_REQUEST,
  ECOCASE_SUCCESS,
  ECOCASE_FAILURE
];

// Fetches a single repository from REST API.
// Relies on the custom API middleware defined in ../middleware/clientMiddleware and helpers/ApiClient.js.
export function fetchEcocase(ecocaseId) {
  return {
    types: ECOCASE_ARRAY,
    promise: (client) => client.get('/ecocases/' + ecocaseId + '/', {
      schema: Schemas.ECOCASE
    })
  };
}

// Fetches a single ecocase from REST API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadEcocase(ecocaseId, requiredFields = []) {
  return (dispatch, getState) => {
    const ecocase = getState().entities.ecocases[ecocaseId];
    if (ecocase && requiredFields.every(key => ecocase.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchEcocase(ecocaseId));
  };
}

/********************************
          submit ecocase
 ********************************/
const SUBMIT_ECOCASE_REQUEST = 'ecocases/ecocases/SUBMIT_ECOCASE_REQUEST';
const SUBMIT_ECOCASE_SUCCESS = 'ecocases/ecocases/SUBMIT_ECOCASE_SUCCESS';
const SUBMIT_ECOCASE_FAILURE = 'ecocases/ecocases/SUBMIT_ECOCASE_FAILURE';

export const SUBMIT_ECOCASE_ARRAY = [
  SUBMIT_ECOCASE_REQUEST,
  SUBMIT_ECOCASE_SUCCESS,
  SUBMIT_ECOCASE_FAILURE
];

export function submitEcocase(submitEcocaseForm) {
  return {
    types: SUBMIT_ECOCASE_ARRAY,
    promise: (client) => client.post('/ecocases/', {
      data: {
        title: submitEcocaseForm.title,
        link: submitEcocaseForm.link
      },
      schema: Schemas.ECOCASE
    })
  };
}


/********************************
          delete ecocase
 ********************************/
const DELETE_ECOCASE_REQUEST = 'ecocases/ecocases/DELETE_ECOCASE_REQUEST';
const DELETE_ECOCASE_SUCCESS = 'ecocases/ecocases/DELETE_ECOCASE_SUCCESS';
const DELETE_ECOCASE_FAILURE = 'ecocases/ecocases/DELETE_ECOCASE_FAILURE';

export const DELETE_ECOCASE_ARRAY = [
  DELETE_ECOCASE_REQUEST,
  DELETE_ECOCASE_SUCCESS,
  DELETE_ECOCASE_FAILURE
];

function fetchDeleteEcocase(ecocaseId) {
  return {
    types: DELETE_ECOCASE_ARRAY,
    promise: (client) => client.del('/ecocases/' + ecocaseId + '/')
  };
}

// Relies on Redux Thunk middleware.
export function deleteEcocase(ecocaseId) {
  return (dispatch, getState) => {
    dispatch(fetchDeleteEcocase(ecocaseId))
      .then(() => {
        const deletedEcocase = getState().entities.ecocases[ecocaseId];
        deletedEcocase.deleted = true;
        dispatch(updateEntity('ecocases', ecocaseId, deletedEcocase));
        dispatch(showDelayedToastMessage({
          type: 'info',
          title: toastMessages.deleteEcocaseTitle,
          body: Object.assign(toastMessages.deleteEcocaseBody, { values: { ecocaseTitle: deletedEcocase.title } })
        }, 30));
      })
    ;
  };
}

/********************************
          upvote ecocase
 ********************************/
const UPVOTE_ECOCASE_REQUEST = 'ecocases/ecocases/UPVOTE_ECOCASE_REQUEST';
const UPVOTE_ECOCASE_SUCCESS = 'ecocases/ecocases/UPVOTE_ECOCASE_SUCCESS';
const UPVOTE_ECOCASE_FAILURE = 'ecocases/ecocases/UPVOTE_ECOCASE_FAILURE';

export const UPVOTE_ECOCASE_ARRAY = [
  UPVOTE_ECOCASE_REQUEST,
  UPVOTE_ECOCASE_SUCCESS,
  UPVOTE_ECOCASE_FAILURE
];

export function upvoteEcocase(ecocaseId) {
  return {
    types: UPVOTE_ECOCASE_ARRAY,
    promise: (client) => client.post('/ecocases/' + ecocaseId + '/upvote/', {
      schema: Schemas.ECOCASE
    })
  };
}

/********************************
    cancel upvote ecocase
 ********************************/
const CANCEL_UPVOTE_ECOCASE_REQUEST = 'ecocases/ecocases/CANCEL_UPVOTE_ECOCASE_REQUEST';
const CANCEL_UPVOTE_ECOCASE_SUCCESS = 'ecocases/ecocases/CANCEL_UPVOTE_ECOCASE_SUCCESS';
const CANCEL_UPVOTE_ECOCASE_FAILURE = 'ecocases/ecocases/CANCEL_UPVOTE_ECOCASE_FAILURE';

export const CANCEL_UPVOTE_ECOCASE_ARRAY = [
  CANCEL_UPVOTE_ECOCASE_REQUEST,
  CANCEL_UPVOTE_ECOCASE_SUCCESS,
  CANCEL_UPVOTE_ECOCASE_FAILURE
];

export function cancelUpvoteEcocase(ecocaseId) {
  return {
    types: CANCEL_UPVOTE_ECOCASE_ARRAY,
    promise: (client) => client.post('/ecocases/' + ecocaseId + '/cancel_upvote/', {
      schema: Schemas.ECOCASE
    })
  };
}

/********************************
 get ecocasesBySortingOption pagination
 ********************************/
const ECOCASES_BY_SORTING_OPTION_REQUEST = 'ecocases/ecocases/ECOCASES_BY_SORTING_OPTION_REQUEST';
const ECOCASES_BY_SORTING_OPTION_SUCCESS = 'ecocases/ecocases/ECOCASES_BY_SORTING_OPTION_SUCCESS';
const ECOCASES_BY_SORTING_OPTION_FAILURE = 'ecocases/ecocases/ECOCASES_BY_SORTING_OPTION_FAILURE';

export const ECOCASES_BY_SORTING_OPTION_ARRAY = [
  ECOCASES_BY_SORTING_OPTION_REQUEST,
  ECOCASES_BY_SORTING_OPTION_SUCCESS,
  ECOCASES_BY_SORTING_OPTION_FAILURE
];

const ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_SORTING_OPTION = 'ecocases/ecocases/ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_SORTING_OPTION';
const ADD_ECOCASE_TO_BOT_AT_ECOCASES_BY_SORTING_OPTION = 'ecocases/ecocases/ADD_ECOCASE_TO_BOT_AT_ECOCASES_BY_SORTING_OPTION';
const DELETE_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION = 'ecocases/ecocases/DELETE_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION';
const DELETE_ALL_AT_ECOCASES_BY_SORTING_OPTION = 'ecocases/ecocases/DELETE_ALL_AT_ECOCASES_BY_SORTING_OPTION';

export const IO_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION_ARRAY = [
  ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_SORTING_OPTION,
  ADD_ECOCASE_TO_BOT_AT_ECOCASES_BY_SORTING_OPTION,
  DELETE_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION,
  DELETE_ALL_AT_ECOCASES_BY_SORTING_OPTION
];

function fetchEcocasesBySortingOption(sortingOption, nextPageUrl) {
  return {
    key: sortingOption,
    types: ECOCASES_BY_SORTING_OPTION_ARRAY,
    promise: (client) => client.get(nextPageUrl, {
      schema: Schemas.ECOCASE_ARRAY
    })
  };
}

// Relies on Redux Thunk middleware.
export function loadEcocasesBySortingOption(sortingOption, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = '/ecocases/?sorting=' + sortingOption,
      pageCount = 0
      } = getState().postings.ecocasesBySortingOption[sortingOption] || {};

    if (pageCount > 0 && !nextPage) {
      return null;
    }

    return dispatch(fetchEcocasesBySortingOption(sortingOption, nextPageUrl));
  };
}

export function addEcocaseToTopAtEcocasesBySortingOption(sortingOption, id) {
  return {
    key: sortingOption,
    type: ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_SORTING_OPTION,
    id
  };
}

export function addEcocaseToBottomAtEcocasesBySortingOption(sortingOption, id) {
  return {
    key: sortingOption,
    type: ADD_ECOCASE_TO_BOT_AT_ECOCASES_BY_SORTING_OPTION,
    id
  };
}

export function deleteEcocaseAtEcocasesBySortingOption(sortingOption, id) {
  return {
    key: sortingOption,
    type: DELETE_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION,
    id
  };
}

export function deleteAllAtEcocasesBySortingOption(sortingOption = null) {
  return {
    key: sortingOption,
    type: DELETE_ALL_AT_ECOCASES_BY_SORTING_OPTION,
  };
}


/********************************
  get ecocasesByAccount pagination
 ********************************/
const ECOCASES_BY_ACCOUNT_REQUEST = 'ecocases/ecocases/ECOCASES_BY_ACCOUNT_REQUEST';
const ECOCASES_BY_ACCOUNT_SUCCESS = 'ecocases/ecocases/ECOCASES_BY_ACCOUNT_SUCCESS';
const ECOCASES_BY_ACCOUNT_FAILURE = 'ecocases/ecocases/ECOCASES_BY_ACCOUNT_FAILURE';

export const ECOCASES_BY_ACCOUNT_ARRAY = [
  ECOCASES_BY_ACCOUNT_REQUEST,
  ECOCASES_BY_ACCOUNT_SUCCESS,
  ECOCASES_BY_ACCOUNT_FAILURE
];

const ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_ACCOUNT = 'ecocases/ecocases/ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_ACCOUNT';
const ADD_ECOCASE_TO_BOTTOM_AT_ECOCASES_BY_ACCOUNT = 'ecocases/ecocases/ADD_ECOCASE_TO_BOTTOM_AT_ECOCASES_BY_ACCOUNT';
const DELETE_ECOCASE_AT_ECOCASES_BY_ACCOUNT = 'ecocases/ecocases/DELETE_ECOCASE_AT_ECOCASES_BY_ACCOUNT';
const DELETE_ALL_AT_ECOCASES_BY_ACCOUNT = 'ecocases/ecocases/DELETE_ALL_AT_ECOCASES_BY_ACCOUNT';

export const IO_ECOCASE_AT_ECOCASES_BY_ACCOUNT_ARRAY = [
  ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_ACCOUNT,
  ADD_ECOCASE_TO_BOTTOM_AT_ECOCASES_BY_ACCOUNT,
  DELETE_ECOCASE_AT_ECOCASES_BY_ACCOUNT,
  DELETE_ALL_AT_ECOCASES_BY_ACCOUNT
];

function fetchEcocasesByAccount(accountId, nextPageUrl) {
  return {
    key: accountId,
    types: ECOCASES_BY_ACCOUNT_ARRAY,
    promise: (client) => client.get(nextPageUrl, {
      schema: Schemas.ECOCASE_ARRAY
    })
  };
}

// Relies on Redux Thunk middleware.
export function loadEcocasesByAccount(accountId, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = '/user/' + accountId + '/ecocases/',
      pageCount = 0
      } = getState().postings.ecocasesByAccount[accountId] || {};

    if (pageCount > 0 && !nextPage) {
      return null;
    }

    return dispatch(fetchEcocasesByAccount(accountId, nextPageUrl));
  };
}

export function addEcocaseToTopAtEcocasesByAccount(accountId, id) {
  return {
    key: accountId,
    type: ADD_ECOCASE_TO_TOP_AT_ECOCASES_BY_ACCOUNT,
    id
  };
}

export function addEcocaseToBottomAtEcocasesByAccount(accountId, id) {
  return {
    key: accountId,
    type: ADD_ECOCASE_TO_BOTTOM_AT_ECOCASES_BY_ACCOUNT,
    id
  };
}

export function deleteEcocaseAtEcocasesByAccount(accountId, id) {
  return {
    key: accountId,
    type: DELETE_ECOCASE_AT_ECOCASES_BY_ACCOUNT,
    id
  };
}

export function deleteAllAtEcocasesByAccount(accountId = null) {
  return {
    key: accountId,
    type: DELETE_ALL_AT_ECOCASES_BY_ACCOUNT,
  };
}

/********************************
          for ecocaseing
 ********************************/
// Relies on Redux Thunk middleware.
export function loadEcocases(type, option, nextPage) {
  return (dispatch, getState) => {
    switch (type) {
      case ECOCASES_BY_SORTING_OPTION :
        return dispatch(loadEcocasesBySortingOption(option, nextPage));
      case ECOCASES_BY_ACCOUNT :
        return dispatch(loadEcocasesByAccount(option, nextPage));
      default:
        throw new Error('Expected postings pagination types.');
    }
  };
}

export function insertEcocaseToEcocasesPagination(id) {
  return (dispatch, getState) => {
    dispatch(addEcocaseToTopAtEcocasesBySortingOption('newest', id));
    dispatch(deleteAllAtEcocasesBySortingOption('comments'));
    dispatch(deleteAllAtEcocasesBySortingOption('upvotes'));
    dispatch(addEcocaseToTopAtEcocasesByAccount(getState().auth.account.id, id));
  };
}
