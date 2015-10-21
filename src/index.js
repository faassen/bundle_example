import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import {addButton} from './a.js';

$(document).ready(() => {
  addButton($('#root'));
});
