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
import '@polymer/paper-checkbox/paper-checkbox.js';

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

                .order-details {
                }

                .cart {
                    display: flex;
                }

                paper-radio-group {
                    display: flex;
                    flex-direction: row;
                    padding: 0 1em;
                    padding-top: 1em;
                }

                h3 {
                    padding: 0 .5em;
                }

                wise-shopping-cart {
                    margin-right: 1em;
                    margin-bottom: 1em;
                    flex: 1;
                }

                .shopping-cart-container {
                    flex: 1;
                    width: 65%;
                }

                .order-details-container {
                    width: 35%;
                }

                .order-details {
                    display: flex;
                    flex-direction: column;
                }

                paper-card {
                    flex: 1;
                    margin-bottom: 1em;
                    padding-bottom: .5em;
                }

                span[slot=prefix] {
                    margin-right: .5em;
                }

                .error-span {
                    color: red;
                    min-height: 1.2em;
                }
                
                .info-span{
                    padding-left: 15.5px;
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
                paper-checkbox {
                    margin: 0.5em;
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

                .total-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .total-container h1, h3{
                    margin: 5px 0;
                }

                .order-details :nth-last-child(2) h3 {
                    margin-bottom: 0;
                }

                .department-number {
                    padding-bottom: 1em;
                }

                #clientComments {
                    padding-bottom: 1em;
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
            </style>

<paper-card heading="Add cluster">
  <paper-input always-float-label label="Name"></paper-input>
  <label id="cloud">Cloud</label>

    <paper-radio-group aria-labelledby="cloud">
      <template is="dom-repeat" items="[[configuration.cluster.cloud.provider]]">
        <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
      </template>
    </paper-radio-group>

  <paper-dropdown-menu label="Region">

    <paper-listbox slot="dropdown-content" class="dropdown-content">
      <paper-item>eu-central-1</paper-item>
      <paper-item>eu-central-2</paper-item>
      <paper-item>eu-central-3</paper-item>
    </paper-listbox>

  </paper-dropdown-menu>
  <div class="border"></div>

  <label id="provisioner">Provisioner</label>
  <paper-radio-group selected="minikube" aria-labelledby="provisioner">
    <template is="dom-repeat" items="[[configuration.cluster.provisioner.type]]">
      <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
    </template>
  </paper-radio-group>

  <paper-dropdown-menu label="Instance Type">
    <paper-listbox slot="dropdown-content" class="dropdown-content">
      <paper-item>m5.large</paper-item>
      <paper-item>m5.large</paper-item>
      <paper-item>m5.large</paper-item>
    </paper-listbox>
  </paper-dropdown-menu>

  <div class="border"></div>
  <label id="cloud">Cluster Components</label>
  <div class="checkbox-container">
    <paper-checkbox checked>Ingress Controller</paper-checkbox>

    <paper-checkbox checked>Kubernetes Dashboard</paper-checkbox>
    <paper-checkbox checked>Logging with ELK</paper-checkbox>
    <paper-checkbox>Monitoring: Prometheus & Grafana</paper-checkbox>
    <paper-checkbox checked>ArgoCD</paper-checkbox>
    <paper-checkbox checked>Cert-Manager LetsEncrypt</paper-checkbox>
  </div>
  <div class="card-content">
    <a href="url">... more components</a>
  </div>
  <div class="border"></div>

  <div class="card-actions">
    <paper-button>Create Cluster</paper-button>
  </div>
</paper-card>

<iron-ajax id="ajax" handle-as="json" on-last-response-changed="_onLastResponseChanged"></iron-ajax>
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
            }
        };
    }

    ready() {
        super.ready();
        this._generateRequest('GET', this.url);

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

}

window.customElements.define('cluster-create-form', ClusterCreateForm);
