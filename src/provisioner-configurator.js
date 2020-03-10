import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';

class ProvisionerConfigurator extends PolymerElement {
    static get template() {
        // language=HTML
        return html`
            <style>
                paper-radio-group {
                    padding: 0 1em;
                    padding-top: 1em;
                }

                label {
                    padding-left: 1em;
                }

                paper-dropdown-menu[hidden] {
                    visibility: hidden;
                }

                paper-input, paper-dropdown-menu {
                    padding: 0 1em;
                    padding-bottom: 1em;
                    width: 50%;
                }

                paper-dropdown-menu {
                    margin-left: 2em;
                }
                paper-item:hover {
                    cursor: pointer;
                }
            </style>
  <label id="provisioner">Provisioner</label>
  <paper-radio-group id="instanceTypeList" aria-labelledby="provisioner">
    <template is="dom-repeat" items="[[configuration.cluster.provisioner.type]]">
      <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
    </template>
  </paper-radio-group>

  <paper-dropdown-menu id="provisionerTypeDropdown" hidden$="[[!_areTypesSet(selectedType)]]" label="Instance Type">
    <paper-listbox selected="{{selectedInstanceType}}" id="typeListbox" slot="dropdown-content" class="dropdown-content">
      <template is="dom-repeat" items="[[selectedType.instanceTypeList]]">
        <paper-item name="[[item.id]]">[[item.name]]</paper-item>
      </template>

    </paper-listbox>
  </paper-dropdown-menu>
        `;
    }

    static get properties() {
        return {
            configuration: {
              type: Object,
            },
            selectedType: {
                type: Object
            },
            selectedInstanceType: {
                type: Object,
                observer: '_provisionerTypeObserver'
            }
        };
    }

    ready() {
        super.ready();
        this.selectedType = {};
        this.addEventListener('paper-radio-group-changed', this.typeSelected);
    }

    _provisionerTypeObserver(val) {
        console.log('_provisionerTypeObserver', val);
        if(val === 999) return;
        let InstanceType = this.selectedType.instanceTypeList[val];
        this.dispatchEvent(new CustomEvent('instance-type-selected',
            {
                detail: InstanceType,
                bubbles: true,
                composed: true
            }
        ));
    }

    typeSelected() {
        this.$.provisionerTypeDropdown.value = '';
        this.$.typeListbox.selected = 999;
        const selectedTypeId = this.$.instanceTypeList.selected;
        let selectedType;
        this.configuration.cluster.provisioner.type.forEach(
            item => {
                if(item.id === selectedTypeId) {
                    //provisioner-selected item

                    selectedType = item;
                    this.dispatchEvent(new CustomEvent('provisioner-selected',
                            {
                                detail: item,
                                bubbles: true,
                                composed: true
                            }
                        ));
                }
            }

        );

        this.selectedType = selectedType;
        console.log('provisioner type selected', this.selectedType);

    }

    _areTypesSet(type) {
        const areSet = !!type && !!type.instanceTypeList && type.instanceTypeList.length > 0;
        console.log('are set', areSet, type);
        return areSet
    }

}
window.customElements.define('provisioner-configurator', ProvisionerConfigurator);