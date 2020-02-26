import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '/node_modules/wise-shopping-cart/wise-shopping-cart.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-spinner/paper-spinner.js';

class WiseShoppingCartContainer extends PolymerElement {
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
                    margin-right: 1em;
                    margin-bottom: 1em;
                    flex: 1;
                }

                .shopping-cart-container {
                    flex: 1;
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
            <div>
                <div class="cart-container">
                    <div class="cart">
                        <div class="shopping-cart-container">
                            <wise-shopping-cart currency-label="[[currencyLabel]]"
                                                cart-items="[[cart.items]]" basket-empty-label="[[basketEmptyLabel]]" start-shopping-label="[[startShoppingLabel]]"></wise-shopping-cart>
                        </div>
                        <div hidden="[[!areThereItems(cart.items)]]" class="order-details-container">
                            <div class="order-details">

                                <paper-card>
                                    <h3>Тип доставки:</h3>
                                    <paper-radio-group id="deliveryType" selected="[[cart.deliveryType]]"
                                                       on-selected-changed="_onDeliveryTypeChange">
                                        <template is="dom-if"
                                                  if="[[cart.configuration.delivery.courier.isCourierActive]]">
                                            <paper-radio-button name="COURIER">[[cart.configuration.delivery.courier.label]] [[_computeCourierLabel(cart.configuration.delivery.courier)]]</paper-radio-button>
                                        </template>
                                        <template is="dom-if"
                                                  if="[[cart.configuration.delivery.postDepartment.isPostDepartmentActive]]">
                                            <paper-radio-button name="POSTSERVICE">[[cart.configuration.delivery.postDepartment.label]]</paper-radio-button>
                                        </template>
                                        <template is="dom-if"
                                                  if="[[cart.configuration.delivery.selfTake.isSelfTakeActive]]">
                                            <paper-radio-button name="SELFTAKE">[[cart.configuration.delivery.selfTake.label]]</paper-radio-button>
                                        </template>
                                    </paper-radio-group>
                                </paper-card>

                                <paper-card>
                                    <h3>Тип оплати:</h3>
                                    <paper-radio-group id="paymentType" selected="[[cart.paymentType]]"
                                                       on-selected-changed="_onPaymentTypeChange">
                                        <template is="dom-if" if="[[cart.configuration.payment.cash.isActive]]">
                                            <paper-radio-button name="CREDITCARD" title="Платіжна система liqpay бере комісію за опрацювання оплати, ось чому ви бачите додану вартість - це комісія платіжної системи">
                                                [[_computeLabel(cart.configuration.payment.creditCard)]]
                                            </paper-radio-button>
                                        </template>
                                        <template is="dom-if"
                                                  if="[[cart.configuration.payment.creditCard.isActivePayByCash]]">
                                            <paper-radio-button name="CASHONDELIVERY">[[cart.configuration.payment.cash.label]]</paper-radio-button>
                                        </template>
                                    </paper-radio-group>
                                </paper-card>

                                <paper-card>
                                    <h3>Замовник:</h3>
                                    <paper-input pattern=".*\\S.*" id="clientName" label="Ім'я" required
                                                 error-message="Заповніть, будь ласка, це поле"
                                                 value="[[cart.client.name]]"
                                                 on-blur="_validateAndSendClientInfo"></paper-input>
                                    <paper-input id="clientPhone" pattern="^\\d{9}$" label="Телефон" required
                                                 error-message="Заповніть, будь ласка, це поле"
                                                 value="[[cart.client.phone]]" on-blur="_validateAndSendClientInfo">
                                        <span slot="prefix">+380</span>
                                    </paper-input>
                                    <paper-input id="clientEmail" type="email" label="Email"
                                                 error-message="Заповніть, будь ласка, це поле"
                                                 value="[[cart.client.email]]" required
                                                 on-blur="_validateAndSendClientInfo"></paper-input>
                                    <paper-input id="clientComments" label="Коментар" value="[[cart.client.comments]]"
                                                 on-blur="_validateAndSendClientInfo"></paper-input>
                                </paper-card>
                                <template is="dom-if" if="[[_isAddressCardVisible(cart.deliveryType)]]">
                                    <paper-card>
                                        <h3>Адреса:</h3>
                                        <div hidden="[[!_isCourierDeliveryType(cart.deliveryType)]]">
                                            <span class="info-span" hidden="[[!cart.client.address.isAddressSetFromMapView]]">
                                                Вказати місцезнаходження на <a href="/selectaddress">карті</a>.</span>
                                            <paper-input id="street" pattern=".*\\S.*" label="Вулиця"
                                                         disabled="[[cart.client.address.isAddressSetFromMapView]]"
                                                         value="{{cart.client.address.street}}" required
                                                         error-message="Заповніть, будь ласка, це поле"
                                                         on-blur="_validateAndGeocodeAddress"></paper-input>
                                            <paper-input id="building" pattern=".*\\S.*"
                                                         disabled="[[cart.client.address.isAddressSetFromMapView]]"
                                                         label="Будинок" value="{{cart.client.address.building}}"
                                                         required error-message="Заповніть, будь ласка, це поле"
                                                         on-blur="_validateAndGeocodeAddress"></paper-input>
                                            <paper-input id="entrance" label="Під'їзд"
                                                         value="[[cart.client.address.entrance]]"
                                                         on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                            <paper-input id="entranceCode" label="Код до під'їзду"
                                                         value="[[cart.client.address.entranceCode]]"
                                                         on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                            <paper-input id="floor" label="Поверх"
                                                         value="[[cart.client.address.floor]]"
                                                         on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                            <paper-input id="apartment" label="Квартира"
                                                         value="[[cart.client.address.apartment]]"
                                                         on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                        </div>

                                        <div hidden="[[_isCourierDeliveryType(cart.deliveryType)]]">
                                            <paper-input id="clientCity"
                                                         value="[[cart.client.postDepartamentInfo.city]]"
                                                         pattern=".*\\S.*"
                                                         label="Місто" required
                                                         error-message="Заповніть, будь ласка, це поле"
                                                         on-blur="_validateAndSendClientPostInfo"></paper-input>
                                            <paper-input id="clientPostDepartmentNumber"
                                                         value="[[cart.client.postDepartamentInfo.postDepartmentNumber]]"
                                                         class="department-number" pattern="^[0-9]*$" label="Відділення"
                                                         required error-message="Заповніть, будь ласка, це поле"
                                                         on-blur="_validateAndSendClientPostInfo">
                                                <span slot="prefix">№</span>
                                            </paper-input>
                                        </div>
                                    </paper-card>
                                </template>
                                <span class="error-span" inner-h-t-m-l="[[errorMessage]]"></span>
                                <div class="total-container">
                                    <h3>Товарів на суму: [[_computeProductsTotal(cart.items)]] [[currencyLabel]]</h3>
                                    <h3>Доставка: [[deliveryPrice]] [[currencyLabel]]</h3>
                                    <h3 hidden="[[!cart.configuration.payment.creditCard.clientPaysProcessingCommission]]">
                                        Комісія онлайн оплати: [[_calculatePaymentOnlineCommission(total, cart.paymentType, cart.configuration.payment.creditCard)]] [[currencyLabel]]
                                    </h3>
                                    <h1>РАЗОМ: [[total]] [[currencyLabel]]</h1>
                                    <paper-button hidden="[[isMakeOrderRequestRunning]]" disabled=[[!cart.items.length]] on-tap="_proceed">NEXT</paper-button>
                                    <paper-spinner active="{{isMakeOrderRequestRunning}}"></paper-spinner>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <iron-ajax id="ajax" handle-as="json" on-last-response-changed="_onLastResponseChanged"></iron-ajax>
            <iron-ajax id="makeOrderAjax" handle-as="json"
                       on-last-response-changed="_onOrderResponseChanged"></iron-ajax>

        `;
    }

    static get properties() {
        return {
            cart: {
                type: Object,
                value: {
                    items: []
                }
            },
            cartId: {
                type: String,
                value: ''
            },
            hostname: {
                type: String,
                value: ''
            },
            errorMessage: String,

            total: {
                type: Number,
                computed: '_calculateTotal(cart)'
            },

            currencyLabel: {
                type: String,
                value: 'USD'
            },

            basketEmptyLabel: {
                type: String,
            },

            startShoppingLabel: {
                type: String,
            },

            courierLabel: String,

            isMakeOrderRequestRunning: {
                type: Boolean,
                value: false
            },

            googleMapsApiKey: {
                type: String,
                value: 'AIzaSyAuKg9jszEEgoGfUlIqmd4n9czbQsgcYRM'
            }
        };
    }

    _computeLabel(paymentInfo) {
        if (paymentInfo.clientPaysProcessingCommission){
            return `${paymentInfo.label} (+${paymentInfo.paymentComission * 100} %)`;
        }
        return paymentInfo.label;
    }

    _computeCourierLabel(courierInfo){
        let label = '';
        if(this.total < courierInfo.minimumPaymentForFreeDelivery) {
            label = ` ( + ${courierInfo.deliveryPrice} ${this.currencyLabel})`
        }

        return label;
    }

    addCartIdParamIfAvailable(isFirst) {
        let param = '';
        if(!this.cartId) {
            return param;
        }

        if(isFirst) {
            param += '?'
        } else {
            param += '&'
        }

        if(this.cartId) {
            param += `cartId=${this.cartId}`
        }
        console.log(`addCartIdParamIfAvailable ${param}`);

        return param;
    }

    ready() {
        super.ready();
        const params = this.addCartIdParamIfAvailable(true);
        const url = this._generateRequestUrl('/api/cart', params);
        this._generateRequest('GET', url);

        this.addEventListener('increase-item-quantity', event => {
            let params = `?uuid=${event.detail}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('POST', this._generateRequestUrl('/api/cart/increase-quantity', params));
            }
        );

        this.addEventListener('decrease-item-quantity', event => {
            let params = `?uuid=${event.detail}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('DELETE', this._generateRequestUrl('/api/cart/decrease-quantity', params));
            }
        );

        this.addEventListener('remove-item', event => {
            let params = `?uuid=${event.detail}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('DELETE', this._generateRequestUrl('/api/cart', params));
            }
        );

    }

    areThereItems(items){
        return items.length !== 0;
    }

    _generateRequest(method, url) {
        const ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.generateRequest();
    }

    _generateRequestUrl(urlPath, params) {
        let url = this.hostname + urlPath;
        if (params) {
            url = url + params;
        }
        return url;
    }

    async _proceed() {
        const deliveryType = this.$.deliveryType;
        const paymentType = this.$.paymentType;
        const requiredInputs = Array.from(this.shadowRoot.querySelectorAll('paper-input[required]')).filter(input => input.offsetWidth > 0 && input.offsetHeight > 0);
        let validInputs = 0;
        if (!deliveryType.selected) {
            this.set('errorMessage', 'Вкажіть, будь ласка, тип доставки');
            return;
        }
        if (!paymentType.selected) {
            this.set('errorMessage', 'Вкажіть, будь ласка, тип оплати');
            return;
        }
        if (this.total <= this.cart.configuration.payment.minimumPaymentForOrder){
            const message = `Мінімальна сума замовлення становить ${this.cart.configuration.payment.minimumPaymentForOrder} ${this.currencyLabel}`;
            this.set('errorMessage', message);
            return;
        }
        this.set('errorMessage', '');

        requiredInputs.forEach(input => {
            if (input.validate()) {
                validInputs++;
            }
        });
        const isValid = validInputs === requiredInputs.length;
        const isCourierDeliverySelected = this.cart.deliveryType === 'COURIER';

        if (isValid && !isCourierDeliverySelected) {
            this._makeOrderRequest();
        }

        if(isCourierDeliverySelected) {

            const address = this.cart.client.address;

            const isAddressSetFromMapView = address.isAddressSetFromMapView;

            let cart = this.cart;

            if(!isAddressSetFromMapView) {
                let cart = await this._geocode(`${address.street} ${address.building}`);
            }

            const isAddressInsideDeliveryBoundaries = cart.client.address.isAddressInsideDeliveryBoundaries;

            if (isValid && (isAddressSetFromMapView || isAddressInsideDeliveryBoundaries)){
                this._makeOrderRequest();
            } else {
                this.errorMessage = `Нажаль Ваша адреса не у зоні доставки. Знайдіть адресу на <a href="${this.hostname}/selectaddress">карті</a>.`;
            }
        }
    }

    _makeOrderRequest(){
        if(this.isMakeOrderRequestRunning) return;

        const ajax = this.$.makeOrderAjax;
        ajax.url = `${this.hostname}/order${this.addCartIdParamIfAvailable(true)}`;
        ajax.method = 'POST';
        this.isMakeOrderRequestRunning = true;
        ajax.generateRequest();
    }

    _onOrderResponseChanged (event, detail)
    {
        console.log('order response', event, detail);
        this.isMakeOrderRequestRunning = false;
        this.cart = {items: []};
        const status = this.$.makeOrderAjax.lastRequest.xhr.status;
        const isSuccessful = status >= 200 && status <= 300;

        if(isSuccessful) {
                this.dispatchEvent(new CustomEvent('order-created',
                    {
                        bubbles: true,
                        composed: true,
                        detail: detail
                    })
                );
        } else {
                this.dispatchEvent(new CustomEvent('order-processing-error',
                    {
                        bubbles: true,
                        composed: true
                    })
                );
        }

    }

    _onLastResponseChanged (event, response) {
        const cartData = response.value;
        console.log(cartData);
        this.dispatchEvent(new CustomEvent('shopping-cart-api-response',
            {
                detail: cartData,
                bubbles: true,
                composed: true
            })
        );
        this.set('cart', cartData ? cartData : {items: []});
    }

    _calculateTotal (cart) {
        if(!this.cart.configuration) return;

        let total = 0;
        let additionPrice;
        let items = cart.items;
        items.forEach(item => {
            additionPrice = 0;
            item.additionList.forEach(addition =>{
                additionPrice += addition.price * addition.quantity;
            });
            total += item.quantity * (item.price + additionPrice);
        });

        if (this.cart.deliveryType === 'COURIER') {
            const freeDelivery = this.cart.configuration.delivery.courier.minimumPaymentForFreeDelivery;
            const isTotalLessOrEqualThenFreeDeliveryOrder = total <= freeDelivery;
            this.deliveryPrice = isTotalLessOrEqualThenFreeDeliveryOrder ? cart.configuration.delivery.courier.deliveryPrice : 0;
            if (isTotalLessOrEqualThenFreeDeliveryOrder) {
                total += this.cart.configuration.delivery.courier.deliveryPrice;
            }
        } else {
            this.deliveryPrice = 0;
        }

        const isClientPaysProcessingCommission = this.cart.paymentType === 'CREDITCARD' && this.cart.configuration.payment.creditCard.clientPaysProcessingCommission;
        if(isClientPaysProcessingCommission) {
            total += total * this.cart.configuration.payment.creditCard.paymentComission;
        }
        return this.roundToTwo(total);
    }

    roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

    _computeProductsTotal(items) {
        let total = 0;
        items.forEach(item => total += item.quantity * item.price)
        total += this._computeAdditionsTotal(items);
        return total;
    }

    _computeAdditionsTotal(items) {
        let additionsTotal = 0;
        items.forEach(item => {
            item.additionList.forEach(addition => {
                additionsTotal += addition.price * addition.quantity;
            })
        });
        return additionsTotal;
    }

    _calculatePaymentOnlineCommission(total, paymentType, paymentConfig) {
        if(!this.cart.configuration) return;

        const isCreditCardSelected = paymentType === 'CREDITCARD';
        let commissionAmount = 0;
        if(paymentConfig.clientPaysProcessingCommission && isCreditCardSelected) {
            commissionAmount = total * paymentConfig.paymentComission;
        }
        return this.roundToTwo(commissionAmount);
    }

    _validateAndGeocodeAddress(event) {
        this._validateAndSendClientAddressInfo(event);
        const address = this.cart.client.address;
        if (address.street && address.building) {
            this._geocode();
        }
    }

    async _geocode(){
        let response = await this._sendGeocodeRequest();
        try {
            const results = response.results;
            const firstResult = results[0];
            const location = firstResult.geometry.location;
            this.cart = await this.updateCartWithAddressLocation(location);
            return this.cart;
        } catch (e) {
            this.errorMessage = `Нажаль ми не змогли знайти Вашу адресу, виберіть її на <a href="${this.hostname}/selectaddress">карті</a>`;
        }
    }

    async getGeocodeData(address) {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.googleMapsApiKey}&address=${address}`;
        let response = await fetch(url);
        return await response.json();
    }

    async updateCartWithAddressLocation(location) {
        const params = `?lat=${location.lat}&lng=${location.lng}${this.addCartIdParamIfAvailable(false)}`;
        let url = this._generateRequestUrl('/api/cart/address/info', params);

        let response = await fetch(url, {
            method: 'PUT'
        });
        return await response.json();
    }

    async _sendGeocodeRequest(){
        const cartAddress = this.cart.client.address;
        const address = `${cartAddress.street} ${cartAddress.building}`;
        return await this.getGeocodeData(address);
    }

    _validateAndSendClientInfo(event) {
        const targetElement = event.target;
        if (targetElement.validate() && targetElement.value) {
            const params = `?${targetElement.id}=${targetElement.value}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('PUT', this._generateRequestUrl('/api/cart/client/info', params));
        }
    }

    _validateAndSendClientAddressInfo(event) {
        const targetElement = event.target;
        if (targetElement.validate() && targetElement.value) {
            const params = `?${targetElement.id}=${targetElement.value}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('PUT', this._generateRequestUrl('/api/cart/address/info', params));
        }
    }

    _validateAndSendClientPostInfo(event) {
        const targetElement = event.target;
        if (targetElement.validate() && targetElement.value) {
            const params = `?${targetElement.id}=${targetElement.value}${this.addCartIdParamIfAvailable(false)}`;
            this._generateRequest('PUT', this._generateRequestUrl('/api/cart/post/info', params));
        }
    }

    _onDeliveryTypeChange(event, data) {
        const params = `?deliverytype=${data.value}${this.addCartIdParamIfAvailable(false)}`;
        this._generateRequest('PUT', this._generateRequestUrl('/api/cart/delivery', params));
    }

    _onPaymentTypeChange(event, data) {
        const params = `?paymenttype=${data.value}${this.addCartIdParamIfAvailable(false)}`;;
        this._generateRequest('PUT', this._generateRequestUrl('/api/cart/payment', params));
    }

    _isAddressCardVisible(deliveryType) {
        const isCourier = deliveryType === 'COURIER';
        const isPostService = deliveryType === 'POSTSERVICE';
        return isCourier || isPostService;
    }

    _isCourierDeliveryType(deliveryType) {
        return deliveryType === 'COURIER';
    }

}

window.customElements.define('wise-shopping-cart-container', WiseShoppingCartContainer);
