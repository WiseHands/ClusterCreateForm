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
import '/src/cluster-provider.js';
import '/src/provisioner-configurator.js';

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
            </style>

<paper-card heading="Add cluster">
  <paper-input always-float-label label="Name"></paper-input>
  <cluster-provider configuration=[[configuration]]></cluster-provider>
  <div class="border"></div>

  <provisioner-configurator configuration=[[configuration]]></provisioner-configurator>

  <div class="border"></div>
  <label id="cloudComponents">Cluster Components</label>
  <div class="checkbox-container">
    <template is="dom-repeat" items="[[configuration.cluster.provisioner.components]]">
      <paper-checkbox name="[[item.id]]">[[item.name]]</paper-checkbox>
    </template>
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
