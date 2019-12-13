import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-image/iron-image.js';
import 'wise-shopping-cart/wise-shopping-cart.js';

class WiseShoppingCartContainer extends PolymerElement {
  static get template() {
    return html`
      <style>
      /*:host {*/
        /*position: fixed;*/
        /*width: 100%;*/
      /*}*/
        app-header {
          background-color: #ebebeb;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
        }
      </style>
      <app-header-layout fullbleed>
        <app-header slot="header" fixed effects="waterfall">
          <app-toolbar>
          <div></div>
              <iron-image sizing="contain" width="30" height="30" src="/images/wiseblack.png"></iron-image>
          </app-toolbar>
          <wise-shopping-cart></wise-shopping-cart>
        </app-header>
      </app-header-layout>
    `;
  }
  constructor() {
    super();
    const items = {"uuid":"92df3d79-4358-40f1-92c2-f73b8eb9ccda","deliveryType":"COURIER","paymentType":"CASHONDELIVERY","lineItemList":[{"uuid":"402881ce6eea99e3016eeb8023a00002","product":{"uuid":"402881ce6df8da72016e0296b1180006","name":"3","description":"3","price":100.0,"categoryName":"test","categoryUuid":"402881ce6d2a3296016d2a336a6f0017","isActive":true,"mainImage":{"uuid":"402881ce6df8da72016e0296b1150005","filename":"e1d433fd-df6c-4f3c-b16d-6a3cabf5a27b.jpg"},"properties":[],"images":[{"uuid":"402881ce6df8da72016e0296b1150005","filename":"e1d433fd-df6c-4f3c-b16d-6a3cabf5a27b.jpg"}]},"quantity":2},{"uuid":"402881ce6eea99e3016eeb802ba50003","product":{"uuid":"402881ce6df8da72016e0296e3970008","name":"Best Pizza Ever with papperoniasdasdadsads","description":"4","price":4.0,"categoryName":"test","categoryUuid":"402881ce6d2a3296016d2a336a6f0017","isActive":true,"mainImage":{"uuid":"402881ce6df8da72016e0296e3950007","filename":"3401a4b7-7cef-4552-a03f-1cedaec19070.jpg"},"properties":[],"images":[{"uuid":"402881ce6df8da72016e0296e3950007","filename":"3401a4b7-7cef-4552-a03f-1cedaec19070.jpg"}]},"quantity":2}],"clientName":"564","clientPhone":"4564","clientComments":"456444"};
    this.set('cartItems', items.lineItemList);
  }
  static get properties() {
    return {
      cartItems: {
        type: Array,
        value: []
      }
    };
  }

  _isInShoppingCartAnyItems (cartItemsLength) {
    return cartItemsLength > 0;
  }

}

window.customElements.define('wise-shopping-cart-container', WiseShoppingCartContainer);