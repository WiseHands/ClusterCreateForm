import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js';
import 'wise-shopping-cart/wise-shopping-cart.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';

class WiseShoppingCartContainer extends PolymerElement {
  static get template() {
    return html`
      <style>
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
          flex-direction: column;
          padding: 0 1em;
        }
        paper-radio-group :first-child {
          padding-top: 0;
        }
        h3 {
          padding: 0 .5em;

        }
        wise-shopping-cart {
          margin-right: .5em;
          flex: 1;
        }
        .con-1 {
          width: 80%;

        }
        .con-2 {
          width: 20%;
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
        
        paper-input {
            padding: 0 1em;
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
        
        .total-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        @media (max-width: 750px) {
          .cart {
            flex-direction: column;
          }
          .con-1, .con-2 {
            width: 100%;
          }
          wise-shopping-cart {
            margin-right: 0;
            
          }
        }
      </style>
      <div>
        <div class="cart-container">
        <div class="cart">
          <div class="con-1">
          <wise-shopping-cart></wise-shopping-cart>
          </div>
          <div class="con-2">
          <div class="order-details">
            <paper-card>
              <h3>Тип доставки:</h3>
              <paper-radio-group selected="Courier">
                <paper-radio-button name="Courier">Кур'єр</paper-radio-button>
                <paper-radio-button name="NewPost">Нова Пошта</paper-radio-button>
                <paper-radio-button name="CashOnDelivery">Самовивіз</paper-radio-button>
              </paper-radio-group>
            </paper-card>
            <paper-card>
              <h3>Тип оплати:</h3>
              <paper-radio-group selected="Online">
                <paper-radio-button name="Online">Онлайн</paper-radio-button>
                <paper-radio-button name="Cash">Готівкою</paper-radio-button>
              </paper-radio-group>
            </paper-card>
            <paper-card>
              <h3>Замовник:</h3>
                <paper-input label="Ім'я"></paper-input>
                <paper-input pattern="/^\\d{9}$/" label="Телефон">
                    <span slot="prefix">+380</span>
                </paper-input>
                <paper-input label="Коментар"></paper-input>

            </paper-card>
            <div class="total-container">
              <h1>СУМА: 750 грн</h1>
              <paper-button>NEXT</paper-button>
            </div>
          </div>
          </div>
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
