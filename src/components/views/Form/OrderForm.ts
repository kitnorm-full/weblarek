import { Form, IFormActions } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IBuyer, TPayment } from '../../../types';

type TOrderFormData = Pick<IBuyer, 'payment' | 'address'> & {
  valid: boolean;
  errors: string;
};

interface IOrderFormActions extends IFormActions {
  onPaymentSelect?: (payment: TPayment) => void;
}

export class OrderForm extends Form<TOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
    super(container, actions);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () => {
      actions?.onPaymentSelect?.('card');
    });
    this.cashButton.addEventListener('click', () => {
      actions?.onPaymentSelect?.('cash');
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}