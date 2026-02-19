import {
  IApi,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get("/product/");
  }

  createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post("/order/", data);
  }
}
