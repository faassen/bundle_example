import $ from 'jquery';

export function addButton(el) {
  el.append($(`<button type="button" class="btn btn-default">
                <span class="glyphicon glyphicon-ok-sign"></span>
              </button>`));
}
