import { mainFunction, clearTrip } from './js/app.js'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save-trip').addEventListener('click', (e) => {
        e.preventDefault();
        mainFunction();
    });
    document.getElementById('clear-trip').addEventListener('click', (e) => {
        e.preventDefault();
        clearTrip();
    })
});

import './styles/style.scss';

export {
    mainFunction
}