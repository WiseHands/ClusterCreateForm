import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-image/iron-image.js';
import 'wise-shopping-cart/wise-shopping-cart.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

class WiseShoppingCartContainer extends PolymerElement {
  static get template() {
    return html`
      <style>
        section {
          display: block;
        }
        .left-empty-container, .right-empty-container {
            flex: .2;
        }
        .cart-container {
        }
        /*wise-shopping-cart {*/
            /*flex: .6;*/
        /*}*/
        .order-details {
            flex: .4;
        }
        .cart {
          max-width: 100%;
        }
      </style>
      <div>

        <div class="cart-container">
        <div class="cart">          <wise-shopping-cart></wise-shopping-cart>
</div>
          <div class="order-details">
            <paper-radio-group selected="Courier">
              <paper-radio-button name="Courier">Кур'єр</paper-radio-button>
              <paper-radio-button name="NewPost">Нова Пошта</paper-radio-button>
              <paper-radio-button name="CashOnDelivery">Самовивіз</paper-radio-button>
            </paper-radio-group>
          </div>
        </div>
      </div>
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
