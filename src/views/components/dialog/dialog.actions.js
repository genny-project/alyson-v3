export const showDialog = ({ layoutName }) => ({
  type: 'DIALOG_TOGGLE',
  payload: {
    show: true,
    layoutName,
  },
});

export const hideDialog = ({ layoutName }) => ({
  type: 'DIALOG_TOGGLE',
  payload: {
    show: false,
    layoutName,
  },
});

export const toggleDialog = ({ layoutName }) => ({
  type: 'DIALOG_TOGGLE',
  payload: {
    layoutName,
  },
});

export const setDialogParams = ({ layoutName, params }) => ({
  type: 'DIALOG_PARAMS_SET',
  payload: {
    layoutName,
    params,
  },
});
