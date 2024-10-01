import isArray from 'is-array';
let Dropdown = await import('teamb/Dropdown');
let LoginModal = await import('./LoginModal');
export default `(HomePage[${Dropdown.default}][${LoginModal.default}][${isArray.name}])`;