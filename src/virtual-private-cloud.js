import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';

class VirtualPrivateCloud extends PolymerElement {
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

                paper-input[hide] {
                    visibility: hidden;
                }

                paper-input, paper-dropdown-menu {
                    padding: 0 1em;
                    padding-bottom: 1em;
                    width: 50%;
                }

                paper-input {
                    margin-left: 2em;
                }
                paper-item:hover {
                    cursor: pointer;
                }
            </style>
  <label id="vpc">Virtual Private Cloud</label>
  <paper-radio-group id="vpcList" selected="[[selectedVpcId]]" aria-labelledby="vpc">
    <template is="dom-repeat" items="[[configuration.cluster.vpc.state]]">
      <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
    </template>
  </paper-radio-group>

  <paper-input label="VPC ID" id="vpcId" on-blur="onVpcIdBlur" hide$="[[!_areStateSet(selectedState)]]"/>
        `;
    }

    static get properties() {
        return {
            configuration: {
              type: Object,
            },
            selectedState: {
                type: Object,
                observer: '_VpcStateObserver'
            }
        };
    }

    static get observers() {
        return [
            'vpcChanged(configuration.cluster.vpc.state)'
        ]
    }

    vpcChanged(list) {
        console.log('list', list);

        this.configuration.cluster.vpc.state.forEach(
            item => {
                if(item.default) {
                    this.selectedVpcId = item.id;
                }
            }
        )
    }

    ready() {
        super.ready();
        this.selectedState = {};
        this.addEventListener('paper-radio-group-changed', this.vpcSelected);
    }

    onVpcIdBlur() {
        let vpcType = this.$.vpcId.value;
        this.dispatchEvent(new CustomEvent('vpc-id-entered',
            {
                detail: vpcType,
                bubbles: true,
                composed: true
            }
        ));
    }

    _VpcStateObserver() {
        let vpcType = this.selectedState;
        this.dispatchEvent(new CustomEvent('vpc-selected',
            {
                detail: vpcType,
                bubbles: true,
                composed: true
            }
        ));
    }

    vpcSelected() {
        const selectedStateId = this.$.vpcList.selected;
        let selectedState;
        this.configuration.cluster.vpc.state.forEach(
            item => {
                if(item.id === selectedStateId) {
                    //provisioner-selected item

                    selectedState = item;
                    this.dispatchEvent(new CustomEvent('vpc-selected',
                            {
                                detail: item,
                                bubbles: true,
                                composed: true
                            }
                        ));
                }
            }

        );

        this.selectedState = selectedState;
        console.log('vpc state selected', this.selectedState);

    }

    _areStateSet(type) {
        const areSet = !!type && type.id === "use-existing";
        console.log('are set', areSet, type);
        return areSet
    }

}
window.customElements.define('virtual-private-cloud', VirtualPrivateCloud);