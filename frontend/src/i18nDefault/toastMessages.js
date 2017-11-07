import { defineMessages } from 'react-intl';

const toastMessages = defineMessages({
  //These messages are used in validation

  //Language setup change in ducks/application
  switchLangTitle: {
    id: 'toast.switchLangTitle',
    defaultMessage: 'Language changed'
  },
  switchLangBody: {
    id: 'toast.switchLangBody',
    defaultMessage: 'Setup {lang}'
  },

  //in containers/DialogWindows/LoginDialog
  loginTitle: {
    id: 'toast.loginTitle',
    defaultMessage: 'Login Succeed'
  },
  loginBody: {
    id: 'toast.loginBody',
    defaultMessage: 'Welcome, {username}.' //empty
  },
  //in containers/DialogWindows/RegisterDialog
  registerTitle: {
    id: 'toast.registerTitle',
    defaultMessage: 'Registered & Login Succeed'
  },
  registerBody: {
    id: 'toast.registerBody',
    defaultMessage: '{username}, Thank you.' //empty
  },
  //in ducks/authentication/auth
  logoutTitle: {
    id: 'toast.logoutTitle',
    defaultMessage: 'Logout Succeed'
  },
  logoutBody: {
    id: 'toast.logoutBody',
    defaultMessage: 'You are safely logout.' //empty
  },

  changeLanguageTitle: {
    id: 'toast.changeLanguageTitle',
    defaultMessage: 'Language setup'
  },
  changeLanguageBody: {
    id: 'toast.changeLanguageBody',
    defaultMessage: 'Your account language setting were changed.' //empty
  },

  changePasswordTitle: {
    id: 'toast.changePasswordTitle',
    defaultMessage: 'Password change succeed'
  },
  changePasswordBody: {
    id: 'toast.changePasswordBody',
    defaultMessage: 'Your password were changed.' //empty
  },

  deleteAccountTitle: {
    id: 'toast.deleteAccountTitle',
    defaultMessage: 'Delete Account Succeed'
  },

  deleteAccountBody: {
    id: 'toast.deleteAccountBody',
    defaultMessage: 'Your account were deleted.' //empty
  },

  //in containers/Posts/EcocaseComposer
  submitEcocaseTitle: {
    id: 'toast.submitEcocaseTitle',
    defaultMessage: 'Ecocase Succeed'
  },
  submitEcocaseBody: {
    id: 'toast.submitEcocaseBody',
    defaultMessage: '\'{ecocaseTitle}\' is posted.' //empty
  },

  //in ducks/postings/ecocases
  deleteEcocaseTitle: {
    id: 'toast.deleteEcocaseTitle',
    defaultMessage: 'Ecocase Deleted'
  },
  deleteEcocaseBody: {
    id: 'toast.deleteEcocaseBody',
    defaultMessage: '\'{ecocaseTitle}\' is deleted.' //empty
  },

  //in containers/Comments/CommentComposer
  submitCommentTitle: {
    id: 'toast.submitCommentTitle',
    defaultMessage: 'Comment added'
  },
  submitCommentBody: {
    id: 'toast.submitCommentBody',
    defaultMessage: 'Your reply is added.' //empty
  },

  //in ducks/postings/ecocases
  deleteCommentTitle: {
    id: 'toast.deleteCommentTitle',
    defaultMessage: 'Comment Deleted'
  },
  deleteCommentBody: {
    id: 'toast.deleteCommentBody',
    defaultMessage: 'A comment is deleted.' //empty
  },

  //in components/UserCard/UserCardComposer
  updateUserCardTitle: {
    id: 'toast.updateUserCardTitle',
    defaultMessage: 'User Information Updated'
  },
  updateUserCardBody: {
    id: 'toast.updateUserCardBody',
    defaultMessage: '@{username} information were saved.'
  },

});

export default toastMessages;
