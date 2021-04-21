import sweetAlert from 'sweetalert2';

// WeakMap will defined in the global scope if native WeakMap is not supported.
const weakMap = new WeakMap(); // eslint-disable-line no-unused-vars

// Set defaults for sweetalert2 popup boxes
const Swal = sweetAlert.mixin({
    buttonsStyling: false,
    customClass: {
        confirmButton: 'button button--primary',
        cancelButton: 'button button--primary-outline',
    },
});

// Re-export
export default Swal;
