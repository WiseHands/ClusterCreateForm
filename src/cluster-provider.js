import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';

class ClusterProvider extends PolymerElement {
    static get template() {
        // language=HTML
        return html`
            <style>
                paper-radio-group {
                    display: flex;
                    flex-direction: row;
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
            </style>

  <label id="cloud">Cloud</label>

    <paper-radio-group id="cloudProvider" aria-labelledby="cloud">
      <template is="dom-repeat" items="[[configuration.cluster.cloud.provider]]">
        <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
      </template>
    </paper-radio-group>

  <paper-dropdown-menu id="regionDropdown" hidden$="[[!_areRegionsSet(selectedProvider)]]" label="Region">

    <paper-listbox id="regionListbox" slot="dropdown-content" class="dropdown-content">
      <template is="dom-repeat" items="[[selectedProvider.regions]]">
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
            selectedProvider: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();
        this.selectedProvider = {};
        this.addEventListener('paper-radio-group-changed', this.providerSelected);
    }

    providerSelected() {
        this.$.regionDropdown.value = '';
        this.$.regionListbox.selected = 999;
        const selectedProviderId = this.$.cloudProvider.selected;
        let selectedProvider;
        this.configuration.cluster.cloud.provider.forEach(
            item => {
                if(item.id === selectedProviderId) {
                     selectedProvider = item;
                }
            }

        );

        this.selectedProvider = selectedProvider;
        console.log('providerSelected', this.selectedProvider);

    }

    _areRegionsSet(provider) {
        const areSet = !!provider && !!provider.regions && provider.regions.length > 0;
        console.log('are set', areSet, provider)
        return areSet
    }

}
window.customElements.define('cluster-provider', ClusterProvider);