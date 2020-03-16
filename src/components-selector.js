import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

class ComponentsSelector extends PolymerElement {
    static get template() {
        // language=HTML
        return html`
            <style>
                label {
                    padding-left: 1em;
                }
                paper-checkbox {
                    margin: 0.5em;
                }
            </style>
  <paper-checkbox id="componentsId" name="[[item.id]]" on-change="_setSelectedState" checked="[[item.default]]">[[item.name]]</paper-checkbox>
        `;
    }

    static get observers() {
        return [
            '_setSelectedState(item)'
        ]
    }

    _setSelectedState() {
        this.item.selected = this.$.componentsId.checked;
    }

}
window.customElements.define('components-selector', ComponentsSelector);