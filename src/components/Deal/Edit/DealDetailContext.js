import React from 'react';

let initContext = {};
let ReloadStoreContext = React.createContext(initContext);
export default ReloadStoreContext;

export const AreaNames = {
  COMMENT_HISTORY: 'COMMENT_HISTORY',
  ACTIVITY_HISTORY: 'ACTIVITY_HISTORY',
  LEARN_HISTORY: 'LEARN_HISTORY',
  CALL_HISTORY: 'CALL_HISTORY',
  ENTIRE_PAGE: 'ENTIRE_PAGE',
  DEAL_STAGE: 'DEAL_STAGE',
  TIMELINE: 'TIMELINE',
  ACCOUNT_TABLE: 'ACCOUNT_TABLE',
};

export let TabOpenStatus = {
  COMMENT_HISTORY: true,
  ACTIVITY_HISTORY: true,
  LEARN_HISTORY: true,
  CALL_HISTORY: true,
};

export let TabStatusContext = React.createContext(TabOpenStatus);

export const DealStatus = {
  ACTIVE: ['OPEN', 'NEW'],
};
