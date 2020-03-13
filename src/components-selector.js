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
  <paper-checkbox id="componentsId" name="[[item.id]]" on-change="onComponentSelect">[[item.name]]</paper-checkbox>
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

/*
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
                    this.selectedVpcIdText = item.vpcId;
                    this.selectedState = item;
                }
            }
        );

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
*/

}
window.customElements.define('components-selector', ComponentsSelector);