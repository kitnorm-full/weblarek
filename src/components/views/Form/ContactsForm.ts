import { Form, IFormActions } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IBuyer } from '../../../types';

type TContactsFormData = Pick<IBuyer, 'email' | 'phone'> & {
  valid: boolean;
  errors: string;
};

export class ContactsForm extends Form<TContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IFormActions) {
    super(container, actions);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.phoneInput.addEventListener('input', () => {
      const value = this.phoneInput.value;
      const hasLeadingPlus = value.startsWith('+');
      const digits = value.replace(/\D/g, '');
      this.phoneInput.value = hasLeadingPlus ? `+${digits}` : digits;
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}