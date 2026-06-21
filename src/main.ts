import "./scss/styles.scss";
import { ProductList } from "./components/models/ProductList";
import { Cart } from "./components/models/Cart";
import { OrderData } from "./components/models/OrderData";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/models/WebLarekApi";
import { EventEmitter } from "./components/base/Events";
import { IProductsResponse } from "./types";
import { API_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";

import { Header } from "./components/views/Header";
import { Modal } from "./components/views/Modal";
import { Gallery } from "./components/views/Gallery";
import { Basket } from "./components/views/Basket";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { Success } from "./components/views/Success";
import { Presenter } from "./components/Presenter";

const events = new EventEmitter();

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const productList = new ProductList(events);
const cart = new Cart(events);
const orderData = new OrderData(events);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const basket = new Basket(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), {
  onSubmit: () => events.emit('order:open'),
});

const orderForm = new OrderForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), {
  onInput: (field, value) => events.emit('order:input', { field, value }),
  onSubmit: () => events.emit('order:submit'),
  onPaymentSelect: (payment) => events.emit('order:paymentSelect', { payment }),
});

const contactsForm = new ContactsForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), {
  onInput: (field, value) => events.emit('contacts:input', { field, value }),
  onSubmit: () => events.emit('contacts:submit'),
});

const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

new Presenter(
  events,
  productList,
  cart,
  orderData,
  webLarekApi,
  header,
  modal,
  gallery,
  basket,
  orderForm,
  contactsForm,
  success,
  cardCatalogTemplate,
  cardPreviewTemplate,
  cardBasketTemplate,
);

webLarekApi
  .getProducts()
  .then((response: IProductsResponse) => {
    productList.setProducts(response.items);
  })
  .catch((error: unknown) => {
    console.error("Ошибка при выполнении запроса к серверу:", error);
  });