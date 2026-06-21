import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface IFormActions {
  onInput?: (field: string, value: string) => void;
  onSubmit?: () => void;
}

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected actions?: IFormActions) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.actions?.onInput?.(target.name, target.value);
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.actions?.onSubmit?.();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}