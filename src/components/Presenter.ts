import { IEvents } from "./base/Events";
import { CDN_URL } from "../utils/constants";
import {
  IProduct,
  IBuyer,
  TPayment,
  IProductList,
  ICart,
  IOrderData,
  IWebLarekApi,
  TCardCatalogFactory,
  ICardPreview,
  IHeader,
  IModal,
  IGallery,
  IBasket,
  IOrderForm,
  IContactsForm,
  ISuccess,
  TCardBasketFactory,
} from "../types";

export class Presenter {
  constructor(
    private events: IEvents,
    private productList: IProductList,
    private cart: ICart,
    private orderData: IOrderData,
    private webLarekApi: IWebLarekApi,
    private header: IHeader,
    private modal: IModal,
    private gallery: IGallery,
    private basket: IBasket,
    private orderForm: IOrderForm,
    private contactsForm: IContactsForm,
    private success: ISuccess,
    private createCatalogCard: TCardCatalogFactory,
    private cardPreview: ICardPreview,
    private createBasketCard: TCardBasketFactory,
  ) {
    this.events.on("catalog:changed", this.handleCatalogChanged);
    this.events.on("card:select", this.handleCardSelect);
    this.events.on("card:toggleBasket", this.handleToggleBasket);
    this.events.on("card:remove", this.handleCardRemove);
    this.events.on("cart:changed", this.handleCartChanged);
    this.events.on("basket:open", this.handleBasketOpen);
    this.events.on("modal:close", this.handleModalClose);

    this.events.on("order:open", this.handleOrderOpen);
    this.events.on("order:input", this.handleOrderInput);
    this.events.on("order:paymentSelect", this.handlePaymentSelect);
    this.events.on("order:submit", this.handleOrderSubmit);
    this.events.on("order:changed", this.handleOrderChanged);
    this.events.on("contacts:input", this.handleContactsInput);
    this.events.on("contacts:submit", this.handleContactsSubmit);
  }

  private handleCatalogChanged = (): void => {
    const cardElements = this.productList.getProducts().map((item) => {
      const card = this.createCatalogCard({
        onClick: () => this.events.emit("card:select", item),
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
    this.openPreview(item);
    this.modal.open();
  };

  private updatePreview(item: IProduct): void {
    const inBasket = this.cart.hasProduct(item.id);
    const noPrice = item.price === null;

    this.cardPreview.render({
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      description: item.description,
      buttonText: noPrice ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить',
      buttonDisabled: noPrice,
    });
  }

  private openPreview(item: IProduct): void {
    this.updatePreview(item);
    this.modal.render({ content: this.cardPreview.render() });
    this.modal.open();
  }

  private handleToggleBasket = (): void => {
    const item = this.productList.getSelectedProduct();
    if (!item) return;

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
    this.renderBasket();

    const selectedProduct = this.productList.getSelectedProduct();
    if (selectedProduct) {
      this.updatePreview(selectedProduct);
    }
  };

  private handleBasketOpen = (): void => {
    this.modal.render({ content: this.basket.render() });
    this.modal.open();
  };

  private renderBasket(): HTMLElement {
    const itemElements = this.cart.getItems().map((item, index) => {
      const card = this.createBasketCard({
        onDeleteClick: () => this.events.emit("card:remove", { id: item.id }),
      });
      return card.render({
        title: item.title,
        price: item.price,
        index: index + 1,
      });
    });

    return this.basket.render({
      items: itemElements,
      total: this.cart.getTotal(),
    });
  }

  private handleOrderOpen = (): void => {
    this.modal.render({ content: this.refreshOrderForm() });
    this.modal.open();
  };

  private refreshOrderForm(): HTMLElement {
    const data = this.orderData.getData();
    const validation = this.orderData.validate();
    const errors = [validation.errors.payment, validation.errors.address]
      .filter(Boolean)
      .join(". ");

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
    this.modal.render({ content: this.refreshContactsForm() });
  };

  private refreshContactsForm(): HTMLElement {
    const data = this.orderData.getData();
    const validation = this.orderData.validate();
    const errors = [validation.errors.email, validation.errors.phone]
      .filter(Boolean)
      .join(". ");

    return this.contactsForm.render({
      email: data.email,
      phone: data.phone,
      valid: !validation.errors.email && !validation.errors.phone,
      errors,
    });
  }

  private handleContactsInput = (data: {
    field: string;
    value: string;
  }): void => {
    this.orderData.setData({ [data.field]: data.value } as Partial<IBuyer>);
  };

  private handleOrderChanged = (): void => {
    this.refreshOrderForm();
    this.refreshContactsForm();
  };

  private handleContactsSubmit = (): void => {
    const buyerData = this.orderData.getData();
    const total = this.cart.getTotal();
    const items = this.cart.getItems().map((item) => item.id);

    this.webLarekApi
      .createOrder({ ...buyerData, items, total })
      .then((response) => {
        this.cart.clear();
        this.orderData.clear();
        const successElement = this.success.render({ total: response.total });
        this.modal.render({ content: successElement });
        this.modal.open();
      })
      .catch((error: unknown) => {
        console.error("Ошибка при оформлении заказа:", error);
      });
  };

  private handleModalClose = (): void => {
    this.modal.close();
  };
}
