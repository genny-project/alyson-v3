import Swal from 'sweetalert2';

const alert = ({ title, message, type, buttons }) => {
  Swal({
    title: title,
    text: message,
    type: type || 'info',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
  .then(( result ) => {
    if ( result.value ) {
      const confirmButtons = buttons.filter( button => button.type === 'ok' );

      if ( buttons != null && confirmButtons.length > 0 ) {
        if ( confirmButtons[0] && confirmButtons[0].onPress ) 
          confirmButtons[0].onPress( confirmButtons[0].type );
      }
    } 
  });

  // window.alert( `${title}\n\n${message}` );
};

export default alert;
