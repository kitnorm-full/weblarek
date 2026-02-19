import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { ProductList } from "./components/Models/ProductList";
import { Cart } from "./components/Models/Cart";
import { OrderData } from "./components/Models/OrderData";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/Models/WebLarekApi";
import { IProductsResponse } from "./types";
import { API_URL } from "./utils/constants";

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

//Проверка ProductList

const productList = new ProductList();
productList.setProducts(apiProducts.items);

console.log("Массив товаров из каталога:", productList.getProducts());

const firstProduct = productList.getProducts()[0];
productList.setSelectedProduct(firstProduct);

console.log("Выбранный товар:", productList.getSelectedProduct());

console.log("Товар по id:", productList.getProductById(firstProduct.id));

//Проверка Cart

const cart = new Cart();

cart.addProduct(firstProduct);
console.log("Товары в корзине:", cart.getItems());

console.log("Количество товаров в корзине:", cart.getCount());

console.log("Общая сумма товаров:", cart.getTotal());

console.log("Есть ли товар в корзине:", cart.hasProduct(firstProduct.id));

cart.removeProduct(firstProduct.id);
console.log("Корзина после удаления:", cart.getItems());

//Проверка OrderData

const orderData = new OrderData();

orderData.setData({ address: "Москва" });
orderData.setData({ email: "test@mail.com" });

console.log("Данные покупателя:", orderData.getData());

const validationResult = orderData.validate();
console.log("Результат валидации:", validationResult);

orderData.clear();
console.log("Данные после очистки:", orderData.getData());

webLarekApi
  .getProducts()
  .then((response: IProductsResponse) => {
    console.log("Каталог товаров, полученный с сервера:", response.items);

    productList.setProducts(response.items);

    console.log(
      "Каталог товаров, сохранённый в модели:",
      productList.getProducts(),
    );
  })
  .catch((error: unknown) => {
    console.error("Ошибка при выполнении запроса к серверу:", error);
  });
