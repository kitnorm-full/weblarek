import { IEvents } from './base/Events';
import { ProductList } from './models/ProductList';
import { Cart } from './models/Cart';
import { OrderData } from './models/OrderData';
import { WebLarekApi } from './models/WebLarekApi';
import { Header } from './views/Header';
import { Modal } from './views/Modal';
import { Gallery } from './views/Gallery';
import { Basket } from './views/Basket';
import { OrderForm } from './views/Form/OrderForm';
import { ContactsForm } from './views/Form/ContactsForm';
import { Success } from './views/Success';
import { CardCatalog } from './views/Card/CardCatalog';
import { CardPreview } from './views/Card/CardPreview';
import { CardBasket } from './views/Card/CardBasket';
import { cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { IProduct, IBuyer, TPayment } from '../types';

type TActiveView = 'preview' | 'basket' | 'order' | 'contacts' | null;

export class Presenter {
  private activeView: TActiveView = null;
  private activeProduct: IProduct | null = null;

  constructor(
    private events: IEvents,
    private productList: ProductList,
    private cart: Cart,
    private orderData: OrderData,
    private webLarekApi: WebLarekApi,
    private header: Header,
    private modal: Modal,
    private gallery: Gallery,
    private basket: Basket,
    private orderForm: OrderForm,
    private contactsForm: ContactsForm,
    private success: Success,
    private cardCatalogTemplate: HTMLTemplateElement,
    private cardPreviewTemplate: HTMLTemplateElement,
    private cardBasketTemplate: HTMLTemplateElement,
  ) {
    this.events.on('catalog:changed', this.handleCatalogChanged);
    this.events.on('card:select', this.handleCardSelect);
    this.events.on('card:toggleBasket', this.handleToggleBasket);
    this.events.on('card:remove', this.handleCardRemove);
    this.events.on('cart:changed', this.handleCartChanged);
    this.events.on('basket:open', this.handleBasketOpen);
    this.events.on('modal:close', this.handleModalClose);

    this.events.on('order:open', this.handleOrderOpen);
    this.events.on('order:input', this.handleOrderInput);
    this.events.on('order:paymentSelect', this.handlePaymentSelect);
    this.events.on('order:submit', this.handleOrderSubmit);
    this.events.on('order:changed', this.handleOrderChanged);
    this.events.on('contacts:input', this.handleContactsInput);
    this.events.on('contacts:submit', this.handleContactsSubmit);
  }

  private handleCatalogChanged = (): void => {
    const cardElements = this.productList.getProducts().map((item) => {
      const card = new CardCatalog(cloneTemplate(this.cardCatalogTemplate), {
        onClick: () => this.events.emit('card:select', item),
      });
      return card.render({
        title: item.title,
        price: item.price,
        image: `${CDN_URL}${item.image}`,
        category: item.category,
      });
    });
    this.gallery.render({ catalog: cardElements });
  };

  private handleCardSelect = (item: IProduct): void => {
    this.productList.setSelectedProduct(item);
    this.activeView = 'preview';
    this.activeProduct = item;
    this.renderPreview(item);
    this.modal.open();
  };

  private renderPreview(item: IProduct): void {
    const card = new CardPreview(cloneTemplate(this.cardPreviewTemplate), {
      onButtonClick: () => this.events.emit('card:toggleBasket', item),
    });
    const cardElement = card.render({
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      description: item.description,
      inBasket: this.cart.hasProduct(item.id),
    });
    this.modal.render({ content: cardElement });
  }

  private handleToggleBasket = (item: IProduct): void => {
    this.activeView = null;
    this.activeProduct = null;

    if (this.cart.hasProduct(item.id)) {
      this.cart.removeProduct(item.id);
    } else {
      this.cart.addProduct(item);
    }

    this.modal.close();
  };

  private handleCardRemove = (data: { id: string }): void => {
    this.cart.removeProduct(data.id);
  };

  private handleCartChanged = (): void => {
    this.header.render({ counter: this.cart.getCount() });

    if (this.activeView === 'preview' && this.activeProduct) {
      this.renderPreview(this.activeProduct);
    }

    if (this.activeView === 'basket') {
      this.renderBasket();
    }
  };

  private handleBasketOpen = (): void => {
    this.activeView = 'basket';
    this.renderBasket();
    this.modal.open();
  };

  private renderBasket(): void {
    const itemElements = this.cart.getItems().map((item, index) => {
      const card = new CardBasket(cloneTemplate(this.cardBasketTemplate), {
        onDeleteClick: () => this.events.emit('card:remove', { id: item.id }),
      });
      return card.render({ title: item.title, price: item.price, index: index + 1 });
    });

    const basketElement = this.basket.render({
      items: itemElements,
      total: this.cart.getTotal(),
    });
    this.modal.render({ content: basketElement });
  }

  private handleOrderOpen = (): void => {
    this.activeView = 'order';
    this.modal.render({ content: this.refreshOrderForm() });
    this.modal.open();
  };

  private refreshOrderForm(): HTMLElement {
    const data = this.orderData.getData();
    const validation = this.orderData.validate();
    const errors = [validation.errors.payment, validation.errors.address]
      .filter(Boolean)
      .join('. ');

    return this.orderForm.render({
      payment: data.payment,
      address: data.address,
      valid: !validation.errors.payment && !validation.errors.address,
      errors,
    });
  }

  private handleOrderInput = (data: { field: string; value: string }): void => {
    this.orderData.setData({ [data.field]: data.value } as Partial<IBuyer>);
  };

  private handlePaymentSelect = (data: { payment: TPayment }): void => {
    this.orderData.setData({ payment: data.payment });
  };

  private handleOrderSubmit = (): void => {
    this.activeView = 'contacts';
    this.modal.render({ content: this.refreshContactsForm() });
  };

  private refreshContactsForm(): HTMLElement {
    const data = this.orderData.getData();
    const validation = this.orderData.validate();
    const errors = [validation.errors.email, validation.errors.phone]
      .filter(Boolean)
      .join('. ');

    return this.contactsForm.render({
      email: data.email,
      phone: data.phone,
      valid: !validation.errors.email && !validation.errors.phone,
      errors,
    });
  }

  private handleContactsInput = (data: { field: string; value: string }): void => {
    this.orderData.setData({ [data.field]: data.value } as Partial<IBuyer>);
  };

  private handleOrderChanged = (): void => {
    if (this.activeView === 'order') {
      this.refreshOrderForm();
    }
    if (this.activeView === 'contacts') {
      this.refreshContactsForm();
    }
  };

  private handleContactsSubmit = (): void => {
    const buyerData = this.orderData.getData();
    const total = this.cart.getTotal();
    const items = this.cart.getItems().map((item) => item.id);

    this.webLarekApi
      .createOrder({ ...buyerData, items, total })
      .then(() => {
        this.activeView = null;
        this.cart.clear();
        this.orderData.clear();

        const successElement = this.success.render({ total });
        this.modal.render({ content: successElement });
        this.modal.open();
      })
      .catch((error: unknown) => {
        console.error('Ошибка при оформлении заказа:', error);
      });
  };

  private handleModalClose = (): void => {
    this.modal.close();
    this.activeView = null;
    this.activeProduct = null;
  };
}