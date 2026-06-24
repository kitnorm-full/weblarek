export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash" | "";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IProductList {
  getProducts(): IProduct[];
  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
}

export interface ICart {
  getItems(): IProduct[];
  getCount(): number;
  getTotal(): number;
  hasProduct(id: string): boolean;
  addProduct(product: IProduct): void;
  removeProduct(id: string): void;
  clear(): void;
}

export interface IOrderData {
  getData(): IBuyer;
  setData(data: Partial<IBuyer>): void;
  validate(): {
    isValid: boolean;
    errors: {
      payment?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
  };
  clear(): void;
}

export interface IWebLarekApi {
  getProducts(): Promise<IProductsResponse>;
  createOrder(data: IOrderRequest): Promise<IOrderResponse>;
}

export interface ICardCatalogActions {
  onClick?: () => void;
}

export interface ICardCatalog {
  render(data: {
    title: string;
    price: number | null;
    image: string;
    category: string;
  }): HTMLElement;
}

export type TCardCatalogFactory = (actions: ICardCatalogActions) => ICardCatalog;

export interface ICardPreview {
  render(data?: {
    title: string;
    price: number | null;
    image: string;
    category: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
  }): HTMLElement;
}

export interface IHeader {
  render(data: { counter: number }): HTMLElement;
}

export interface IModal {
  render(data: { content: HTMLElement }): HTMLElement;
  open(): void;
  close(): void;
}

export interface IGallery {
  render(data: { catalog: HTMLElement[] }): HTMLElement;
}

export interface IBasket {
  render(data?: { items: HTMLElement[]; total: number }): HTMLElement;
}

export interface IOrderForm {
  render(data: { payment: TPayment; address: string; valid: boolean; errors: string }): HTMLElement;
}

export interface IContactsForm {
  render(data: { email: string; phone: string; valid: boolean; errors: string }): HTMLElement;
}

export interface ISuccess {
  render(data: { total: number }): HTMLElement;
}

export interface ICardBasketActions {
  onDeleteClick?: () => void;
}

export interface ICardBasket {
  render(data: { title: string; price: number | null; index: number }): HTMLElement;
}

export type TCardBasketFactory = (actions: ICardBasketActions) => ICardBasket;