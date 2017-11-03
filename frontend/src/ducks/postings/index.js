const debug = require('utils/getDebugger')('postings');
import { combineReducers } from 'redux';
import paginate from 'helpers/paginate';
import { ECOCASES_BY_SORTING_OPTION_ARRAY, IO_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION_ARRAY,
  ECOCASES_BY_ACCOUNT_ARRAY, IO_ECOCASE_AT_ECOCASES_BY_ACCOUNT_ARRAY } from './ecocases';
import { COMMENTS_BY_ECOCASE_ARRAY, IO_COMMENT_AT_COMMENTS_BY_ECOCASE_ARRAY,
  COMMENTS_BY_ACCOUNT_ARRAY, IO_COMMENT_AT_COMMENTS_BY_ACCOUNT_ARRAY } from './comments';

export const ECOCASES_BY_SORTING_OPTION = 'ecocasesBySortingOption';
export const ECOCASES_BY_ACCOUNT = 'ecocasesByAccount';
export const COMMENTS_BY_ECOCASE = 'commentsByEcocase';
export const COMMENTS_BY_ACCOUNT = 'commentsByAccount';

const postings = combineReducers({
  [ECOCASES_BY_SORTING_OPTION]: paginate({
    mapActionToKey: action => action.key,
    types: ECOCASES_BY_SORTING_OPTION_ARRAY,
    subTypes: IO_ECOCASE_AT_ECOCASES_BY_SORTING_OPTION_ARRAY
  }),

  [ECOCASES_BY_ACCOUNT]: paginate({
    mapActionToKey: action => action.key,
    types: ECOCASES_BY_ACCOUNT_ARRAY,
    subTypes: IO_ECOCASE_AT_ECOCASES_BY_ACCOUNT_ARRAY
  }),

  [COMMENTS_BY_ECOCASE]: paginate({
    mapActionToKey: action => action.key,
    types: COMMENTS_BY_ECOCASE_ARRAY,
    subTypes: IO_COMMENT_AT_COMMENTS_BY_ECOCASE_ARRAY
  }),

  [COMMENTS_BY_ACCOUNT]: paginate({
    mapActionToKey: action => action.key,
    types: COMMENTS_BY_ACCOUNT_ARRAY,
    subTypes: IO_COMMENT_AT_COMMENTS_BY_ACCOUNT_ARRAY
  })

});

export default postings;
