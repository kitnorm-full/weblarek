import { IProduct } from "../../types";
import { IEvents } from "../base/Events"

export class Cart {
  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed');
  }

  removeProduct(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('cart:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      if (item.price === null) {
        return total;
      }
      return total + item.price;
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
