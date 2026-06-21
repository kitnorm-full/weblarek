import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { IProduct } from '../../../types';

type TCardPreviewData = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'description'> & {
  inBasket: boolean;
};

interface ICardPreviewActions {
  onButtonClick?: () => void;
}

export class CardPreview extends Card<TCardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onButtonClick) {
      this.buttonElement.addEventListener('click', actions.onButtonClick);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === value,
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    this.buttonElement.disabled = value === null;
    if (value === null) {
      this.buttonElement.textContent = 'Недоступно';
    }
  }

  set inBasket(value: boolean) {
    if (this.buttonElement.disabled) return;
    this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
  }
}