import Swal from 'sweetalert2';
import toastr from 'toastr';
import './alert.css';

const types = ['warning', 'info', 'success', 'error'];

toastr.options = {
  closeButton: true,
  progressBar: true,
  closeHtml: '<button><i class="material-icons">close</i></button>',
  showDuration: 30000, // 30 seconds
};

const alert = ({
  title,
  message,
  type,
  buttons,
  toast,
}) => {
  if ( toast ) {
    const toastType = types.includes( type ) ? type : 'info';

    toastr[toastType]( message, title );
  }
  else {
    Swal({
      title: title,
      text: message,
      type: type || 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    })
    .then( result => {
      if ( result.value ) {
        const confirmButtons = buttons.filter( button => button.type === 'ok' );

        if ( buttons != null && confirmButtons.length > 0 ) {
          if ( confirmButtons[0] && confirmButtons[0].onPress )
            confirmButtons[0].onPress( confirmButtons[0].type );
        }
      }
    });
  }
};

export default alert;
