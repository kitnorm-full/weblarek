import { Component } from '../base/Component';
import { ensureElement, createElement } from '../../utils/utils';

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

interface IBasketActions {
  onSubmit?: () => void;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    if (actions?.onSubmit) {
      this.buttonElement.addEventListener('click', actions.onSubmit);
    }
  }

  set items(value: HTMLElement[]) {
    if (value.length) {
      this.listElement.replaceChildren(...value);
    } else {
      this.listElement.replaceChildren(
        createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }),
      );
    }
    this.buttonElement.disabled = value.length === 0;
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}