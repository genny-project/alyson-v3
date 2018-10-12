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
