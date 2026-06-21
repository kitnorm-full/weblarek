import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

type TCardBasketData = Pick<IProduct, 'title' | 'price'> & { index: number };

interface ICardBasketActions {
  onDeleteClick?: () => void;
}

export class CardBasket extends Card<TCardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDeleteClick) {
      this.deleteButton.addEventListener('click', actions.onDeleteClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}