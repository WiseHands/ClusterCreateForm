import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '/node_modules/wise-shopping-cart/wise-shopping-cart.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-ajax/iron-ajax.js';

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
        .shopping-cart-container {
          width: 80%;
        }
        .order-details-container {
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
        paper-button[disabled] {
            border: 2px solid grey;
            color: grey;
        }
        .total-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .order-details :nth-last-child(2) h3 {
            margin-bottom: 0;
        }
        @media (max-width: 750px) {
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
      <div>
        <div class="cart-container">
          <div class="cart">
            <div class="shopping-cart-container">
                <wise-shopping-cart cart-items="[[cart.lineItemList]]"></wise-shopping-cart>
            </div>
            <div class="order-details-container">
              <div class="order-details">
                <paper-card>
                  <h3>Тип доставки:</h3>
                  <paper-radio-group selected="[[_setSelectedDeliveryType(cart.deliveryType)]]" on-selected-changed="_onDeliveryTypeChange">
                    <paper-radio-button name="COURIER">Кур'єр</paper-radio-button>
                    <paper-radio-button name="NOVAPOSHTA">Нова Пошта</paper-radio-button>
                    <paper-radio-button name="SELFTAKE">Самовивіз</paper-radio-button>
                  </paper-radio-group>
                </paper-card>
                <paper-card>
                  <h3>Тип оплати:</h3>
                  <paper-radio-group selected="[[_setSelectedPaymentType(cart.paymentType)]]" on-selected-changed="_onPaymentTypeChange">
                    <paper-radio-button name="PAYONLINE">Онлайн</paper-radio-button>
                    <paper-radio-button name="CASHONSPOT">Готівкою</paper-radio-button>
                  </paper-radio-group>
                </paper-card>
                <paper-card>
                  <h3>Замовник:</h3>
                    <paper-input id="clientName" label="Ім'я" required error-message="Заповніть, будь ласка, це поле" value="[[cart.clientName]]"></paper-input>
                    <paper-input id="clientPhone" pattern="^\\d{9}$" label="Телефон" required error-message="Заповніть, будь ласка, це поле" value="[[cart.clientPhone]]">
                        <span slot="prefix">+380</span>
                    </paper-input>
                    <paper-input id="clientComment" label="Коментар" value="[[cart.clientComments]]"></paper-input>
                </paper-card>
                <div class="total-container">
                  <h1>СУМА: [[_calculateTotal(cart.lineItemList)]] грн</h1>
                  <paper-button disabled=[[!cart.lineItemList.length]] on-tap="_proceed">NEXT</paper-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <iron-ajax id="ajax" handle-as="json" on-last-response-changed="_onLastResponseChanged"></iron-ajax>
    `;
  }
  constructor() {
    super();
  }

  ready() {
    super.ready();
    this._generateRequest('GET', 'http://localhost:3334/api/cart?cartId=6b342119-61fc-40f1-91af-876105fd6f2b');
    this.addEventListener('decrease-item-quantity', event => {
        this._generateRequest('DELETE', `http://localhost:3334/api/cart/decrease-quantity?uuid=${event.detail}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
      }
    );
    this.addEventListener('increase-item-quantity', event => {
        this._generateRequest('POST', `http://localhost:3334/api/cart/increase-quantity?uuid=${event.detail}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
      }
    );
    this.addEventListener('remove-item', event => {
        this._generateRequest('DELETE', `http://localhost:3334/api/cart?uuid=${event.detail}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
      }
    );

  }

  static get properties() {
    return {
      cart: {
        type: Object,
        value: {
          lineItemList: []
        }
      }
    };
  }

  _proceed () {
    const inputs = this.shadowRoot.querySelectorAll('paper-input[required]');
    let isValidCounter = 0;
    inputs.forEach(input => {
      if (input.validate()) {
        isValidCounter ++;
      }
    });
    const isValid = inputs.length === isValidCounter;
    if (isValid) {
      this._sendClientData();
    }
  }

  _sendClientData () {
    const clientName = this.$.clientName.value;
    const clientPhone = this.$.clientPhone.value;
    const clientComment = this.$.clientComment.value;

    this._generateRequest('PUT', `http://localhost:3334/api/cart/client/info?clientname=${clientName}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
    this._generateRequest('PUT', `http://localhost:3334/api/cart/client/info?clientphone=${clientPhone}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
    this._generateRequest('PUT', `http://localhost:3334/api/cart/client/info?clientcomments=${clientComment}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
  }

  _generateRequest (method, url) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.generateRequest();
  }

  _onLastResponseChanged (event, response) {
    const cartData = response.value;
    this.set('cart', cartData ? cartData : {lineItemList: []});
  }

  _calculateTotal (items) {
    let total = 0;
    items.forEach(item => {
      total += item.quantity * item.product.price;
    });
    return total;
  }

  _onDeliveryTypeChange (event, data) {
    this._generateRequest('PUT', `http://localhost:3334/api/cart/delivery?deliverytype=${data.value}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
  }

  _setSelectedDeliveryType (deliveryType) {
    return deliveryType ? deliveryType : 'COURIER';
  }

  _onPaymentTypeChange (event, data) {
    this._generateRequest('PUT', `http://localhost:3334/api/cart/payment?paymenttype=${data.value}&cartId=6b342119-61fc-40f1-91af-876105fd6f2b`);
  }

  _setSelectedPaymentType (paymentType) {
    return paymentType ? paymentType : 'ONLINE';
  }

}

window.customElements.define('wise-shopping-cart-container', WiseShoppingCartContainer);
