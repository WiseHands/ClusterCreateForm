import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-button/paper-button.js';
import '/src/cluster-provider.js';
import '/src/provisioner-configurator.js';
import '/src/virtual-private-cloud.js';
import '/src/components-selector.js';

class ClusterCreateForm extends PolymerElement {
    static get template() {
        // language=HTML
        return html`            
            <style>
                :host {
                    display: block;
                }

                section {
                    display: block;
                }

                paper-radio-group {
                    padding: 0 1em;
                    padding-top: 1em;
                }

                h3 {
                    padding: 0 .5em;
                }

                paper-card {
                    flex: 1;
                    margin-bottom: 1em;
                    padding-bottom: .5em;
                    width: 100%;
                }

                span[slot=prefix] {
                    margin-right: .5em;
                }

                .error-span {
                    color: red;
                    min-height: 1.2em;
                }

                paper-input, paper-dropdown-menu {
                    padding: 0 1em;
                    padding-bottom: 1em;
                    width: 50%;
                }

                paper-dropdown-menu {
                    margin-left: 2em;
                }

                .checkbox-container {
                    display: flex;
                    flex-direction: column;
                    margin: 1em 1em 1em 2.5em;
                }

                .border {
                    border-top: 1px solid #e8e8e8;
                    margin-top: 1em;
                    margin-bottom: 1em;
                    margin-left: 1em;
                    margin-right: 1em;
                }

                label {
                    padding-left: 1em;
                }

                .card-actions {
                    border-top: 0;
                }

                h1 {
                    font-size: 1.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                paper-button {
                    background-color: #fff;
                    color: #000;
                    border: 2px solid #000;
                    border-radius: 0;
                    width: fit-content;
                    margin-right: 0;
                }

                paper-button:hover {
                    background-color: #000;
                    color: #fff;
                    border: 2px solid #fff;
                }

                paper-button[disabled] {
                    border: 2px solid grey;
                    color: grey;
                }

                paper-spinner[active] {
                    display: block;
                }
                paper-spinner {
                    display: none;
                }

                @media (max-width: 1024px) {
                    .cart {
                        flex-direction: column;
                    }

                    .shopping-cart-container, .order-details-container {
                        width: 100%;
                    }

                    wise-shopping-cart {
                        margin-right: 0;
                    }
                }

                paper-dropdown-menu[hidden] {
                    visibility: hidden;
                }
                
                pre {
                    padding: 5px 16px;
                }
            </style>

<paper-card heading="Add cluster">
  <paper-input id="clusterName" always-float-label label="Name" value="[[configuration.cluster.name]]"></paper-input>
  <cluster-provider configuration=[[configuration]]></cluster-provider>

    <div class="border"></div>

    <virtual-private-cloud configuration=[[configuration]]></virtual-private-cloud>
    
  <div class="border"></div>

  <provisioner-configurator configuration=[[configuration]]></provisioner-configurator>

  <div class="border"></div>
  <label id="cloudComponents">Cluster Components</label>
  <div class="checkbox-container">
    <template is="dom-repeat" items="[[configuration.cluster.provisioner.components]]">
        <components-selector item="[[item]]"></components-selector>
    </template>
  </div>
  <div class="card-content">
<!--    <a href="url">... more components</a>-->
  </div>
  <div class="border"></div>

  <div class="card-actions">
    <paper-button on-click="sendClusterData">Create Cluster</paper-button>
  </div>

    <pre><code class="yaml" id="responseYaml">...</code></pre>
    <a href="https://github.com/WiseHands/ClusterDev/blob/master/config.yaml">Link to config file on GitHub</a>
</paper-card>

            <iron-ajax id="ajax" handle-as="json" on-last-response-changed="_onLastResponseChanged"></iron-ajax>
            <iron-ajax id="createCluster" handle-as="text" on-last-response-changed="_onCreateClusterResponse"></iron-ajax>
        `;
    }

    static get properties() {
        return {
            configuration: {
              type: Object,
            },
            url: {
                type: String,
                value: 'src/cluster.json'
            },
            selectedComponents: []
        };
    }

    ready() {
        super.ready();

        this.addEventListener('cluster-provider-selected', this.onClusterProviderSelected);
        this.addEventListener('cluster-region-selected', this.onClusterRegionSelected);
        this.addEventListener('provisioner-selected', this.onProvisionerSelected);
        this.addEventListener('instance-type-selected', this.onProvisionerTypeSelected);
        this.addEventListener('vpc-selected', this.onVpcSelected);
        this.addEventListener('vpc-id-entered', this.onVpcIdEntered);
        this.addEventListener('component-selected', this.onClusterComponentsChecked);
        this.addEventListener('default-component-selected', this.onDefaultClusterComponentsChecked);

        this._generateRequest('GET', this.url);

        this.selectedComponents = [];

    }

    onClusterRegionSelected(event) {
        console.log('onClusterRegionSelected: ', event, event.detail);
        this.selectedClusterRegionSelected = event.detail.id;
    }

    onClusterProviderSelected(event) {
        console.log('onClusterProviderSelected: ', event, event.detail);
        this.selectedClusterProviderSelected = event.detail.id;
    }

    onProvisionerSelected(event) {
        console.log('onProvisionerSelected: ', event, event.detail);
        this.selectedProvisionerId = event.detail.id;
    }

    onProvisionerTypeSelected(event) {
        console.log('onProvisionerTypeSelected: ', event, event.detail);
        this.selectedProvisionerTypeSelected = event.detail.id;
    }

    onVpcSelected(event) {
        console.log('onVpcSelected: ', event, event.detail);
        this.selectedVpcSelected = event.detail;
    }

    onVpcIdEntered(event) {
        console.log('onVpcIdEntered', event.detail);
        this.vpcId = event.detail;
    }

    onClusterComponentsChecked(event) {
        console.log('onClusterComponentsChecked', event.detail);
        let component = event.detail;
        if(component.selected) {
            delete component.selected;
            this.selectedComponents.push(component);
        } else {
            let _index = 0;
            this.selectedComponents.forEach(
                (item, index) => {
                    if(item.name === component.name) {
                        _index = index;
                    }
                }
            );
            this.selectedComponents.splice(_index, 1);
        }

        this.componentsId = event.detail;
    }

    onDefaultClusterComponentsChecked(event) {
        console.log('onDefaultClusterComponentsChecked', event.detail);
        let component = event.detail;
        if(component.selected) {
            delete component.selected;
            this.selectedComponents.push(component);
        } else {
            let _index = 0;
            this.selectedComponents.forEach(
                (item, index) => {
                    if(item.name === component.name) {
                        _index = index;
                    }
                }
            );
            this.selectedComponents.splice(_index, 1);
        }

        this.componentsId = event.detail;
    }

    _generateRequest(method, url) {
        const ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.generateRequest();
    }

    _onLastResponseChanged (event, response) {
        console.log(response.value);
        this.configuration = response.value;
    }

    sendClusterData() {
        const clusterName = this.$.clusterName.value || "";
        let vpcId = this.selectedVpcSelected.id;
        if(this.selectedVpcSelected.id === 'use-existing') {
            vpcId = this.selectedVpcSelected.vpcId;
        }

        const body = {
            cluster: {
                name: clusterName,
                installed: true,
                cloud: {
                    provider: this.selectedClusterProviderSelected,
                    region: this.selectedClusterRegionSelected,
                    vpc: vpcId,
                    domain: "shalb.net"
                },
                provisioner: {
                    type: this.selectedProvisionerId,
                    instanceType: this.selectedProvisionerTypeSelected
                }
            },
            apps: this.selectedComponents
        };

        const createCluster = this.$.createCluster;
        createCluster.method = "POST";
        createCluster.url = "http://127.0.0.1:5447/cluster";
        createCluster.body = JSON.stringify(body);

        createCluster.generateRequest();
    }

    _onCreateClusterResponse (event, response) {
        console.log(response, response.value);
        let text = response.value;
        text = text.replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br>');
        this.$.responseYaml.innerHTML = text;
    }



}

window.customElements.define('cluster-create-form', ClusterCreateForm);
