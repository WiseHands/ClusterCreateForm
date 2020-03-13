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
  <paper-checkbox id="componentsId" name="[[item.id]]" on-change="onComponentSelect" checked="[[item.default]]">[[item.name]]</paper-checkbox>
        `;
    }

    onComponentSelect() {
        this.item.selected = this.$.componentsId.checked;
        this.dispatchEvent(new CustomEvent('component-selected',
            {
                detail: this.item,
                bubbles: true,
                composed: true
            }
        ));
    }

    static get observers() {
        return [
            'componentsChecked(item)'
        ]
    }

    componentsChecked(item) {
        console.log('componentsChecked', item);
       if(item.default) {
           this.dispatchEvent(new CustomEvent('default-component-selected',
               {
                   detail: item,
                   bubbles: true,
                   composed: true
               }
           ));
       }

    }

}
window.customElements.define('components-selector', ComponentsSelector);