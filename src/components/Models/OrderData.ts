import { IBuyer, TPayment } from "../../types";

export class OrderData {
  private payment: TPayment;
  private address: string;
  private phone: string;
  private email: string;

  constructor() {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validate(): {
    isValid: boolean;
    errors: {
      payment?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
  } {
    const errors: {
      payment?: string;
      address?: string;
      phone?: string;
      email?: string;
    } = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.address) {
      errors.address = "Адрес не заполнен";
    }

    if (!this.phone) {
      errors.phone = "Телефон не заполнен";
    }

    if (!this.email) {
      errors.email = "Email не заполнен";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
