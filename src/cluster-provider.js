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

  <label id="cloud">Cloud</label>

    <paper-radio-group id="cloudProvider" selected="{{selectedProviderId}}" aria-labelledby="cloud">
      <template is="dom-repeat" items="[[configuration.cluster.cloud.providerList]]">
        <paper-radio-button name="[[item.id]]">[[item.name]]</paper-radio-button>
      </template>
    </paper-radio-group>

  <paper-dropdown-menu id="regionDropdown" hidden$="[[!_areRegionsSet(selectedProvider)]]" label="Region">

    <paper-listbox selected="{{selectedRegion}}" id="regionListbox" slot="dropdown-content" class="dropdown-content">
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
                type: Object,
            },
            selectedRegion: {
                type: Object,
                observer: '_regionObserver'
            }
        };
    }

    static get observers() {
        return [
            'providerChanged(configuration.cluster.cloud.providerList)'
        ]
    }

    // Element class can define custom element reactions
    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'I\'m a custom element!';
        console.log('my-element created!');
    }

    providerChanged(list) {
        console.log('list', list);

        this.configuration.cluster.cloud.providerList.forEach(
            item => {
                    if(item.default) {
                       this.selectedProviderId = item.id;
                       this.selectedProvider = item;
                    }
            }
        );

        this.selectedProvider.regions.forEach(
            (region, index) => {
                if(region.default)
                    this.$.regionListbox.selected = index;
            }
        )
    }

    ready() {
        super.ready();
        this.addEventListener('paper-radio-group-changed', this.providerSelected);
    }

    _regionObserver(val) {
        if(val === 999) return;

        this.dispatchEvent(new CustomEvent('cluster-region-selected',
            {
                detail: this.selectedRegion,
                bubbles: true,
                composed: true
            }
        ));
    }


    providerSelected() {
        this.$.regionDropdown.value = '';
        this.$.regionListbox.selected = 999;
        const selectedProviderId = this.$.cloudProvider.selected;
        let selectedProvider;
        this.configuration.cluster.cloud.providerList.forEach(
            item => {
                if(item.id === selectedProviderId) {
                     selectedProvider = item;
                    this.dispatchEvent(new CustomEvent('cluster-provider-selected',
                        {
                            detail: item,
                            bubbles: true,
                            composed: true
                        }
                    ));
                }
            }

        );

        this.selectedProvider = selectedProvider;
        console.log('providerSelected', this.selectedProvider);

    }

    _areRegionsSet(providerList) {
        const areSet = !!providerList && !!providerList.regions && providerList.regions.length > 0;
        console.log('are set', areSet, providerList);
        return areSet
    }

}
window.customElements.define('cluster-provider', ClusterProvider);