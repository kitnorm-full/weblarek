# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct
Описывает структуру товара, получаемого с сервера.

`id: string` — уникальный идентификатор товара;
`description: string` — описание товара;
`image: string` — путь к изображению;
`title: string` — название товара;
`category: string` — категория товара;
`price: number | null` — цена товара (может отсутствовать).

#### Интерфейс IBuyer
Описывает данные покупателя.

`payment: TPayment` — способ оплаты;
`email: string` — email покупателя;
`phone: string` — номер телефона покупателя;
`address: string` — адрес доставки.

#### Интерфейс IProductList
Описывает контракт модели каталога товаров для инверсии зависимостей.

`getProducts(): IProduct[]` — получение массива товаров;
`getSelectedProduct(): IProduct | null` — получение выбранного товара;
`setSelectedProduct(product: IProduct): void` — сохранение выбранного товара.

#### Интерфейс ICart
Описывает контракт модели корзины для инверсии зависимостей.

`getItems(): IProduct[]` — получение массива товаров в корзине;
`getCount(): number` — получение количества товаров;
`getTotal(): number` — получение итоговой суммы;
`hasProduct(id: string): boolean` — проверка наличия товара;
`addProduct(product: IProduct): void` — добавление товара;
`removeProduct(id: string): void` — удаление товара;
`clear(): void` — очистка корзины.

#### Интерфейс IOrderData
Описывает контракт модели данных покупателя для инверсии зависимостей.

`getData(): IBuyer` — получение данных покупателя;
`setData(data: Partial<IBuyer>): void` — сохранение данных покупателя;
`validate()` — валидация данных покупателя;
`clear(): void` — очистка данных покупателя.

### Модели данных

#### Класс ProductList
Хранение и управление списком товаров.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий. Создаёт экземпляр класса с пустым массивом товаров (`products = []`) и отсутствующим выбранным товаром (`selectedProduct = null`).

Поля:
`products: IProduct[]` — хранит массив всех товаров;
`selectedProduct: IProduct | null` — хранит товар, выбранный для подробного отображения.
`events: IEvents` — брокер событий.

Методы:
`setProducts(products: IProduct[]): void` — сохранение массива товаров полученного в параметрах метода;
`getProducts(): IProduct[]` — получение массива товаров из модели;
`getProductById(id: string): IProduct | undefined` — получение одного товара по его id;
`setSelectedProduct(product: IProduct): void` — сохранение товара для подробного отображения;
`getSelectedProduct(): IProduct | null` — получение товара для подробного отображения.

#### Класс Cart
Хранит массив товаров, выбранных покупателем для покупки.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий. Создаёт экземпляр корзины с пустым массивом товаров (`items = []`).

Поля:
`items: IProduct[]` — массив товаров в корзине;
`events: IEvents` — брокер событий.

Методы:
`getItems(): IProduct[]` — получение массива товаров, которые находятся в корзине;
`addProduct(product: IProduct): void` — добавление товара, который был получен в параметре, в массив корзины;
`removeProduct(id: string): void` — удаление товара, полученного в параметре из массива корзины;
`clear(): void` — очистка корзины;
`getTotal(): number` — получение стоимости всех товаров в корзине;
`getCount(): number` — получение количества товаров в корзине;
`hasProduct(id: string): boolean` — проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Класс OrderData
Отвечает за хранение данных покупателя и валидацию данных при оформлении заказа.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий. Создаёт экземпляр модели с пустыми данными покупателя (`payment = ''`, `address = ''`, `phone = ''`, `email = ''`).

Поля:
`payment: TPayment` — вид оплаты;
`address: string` — адрес;
`phone: string` — телефон;
`email: string` — email;
`events: IEvents` — брокер событий.

Методы:
`setData(data: Partial<IBuyer>): void` — сохраняет данные покупателя;
`getData(): IBuyer` — получение всех данных покупателя;
`clear(): void` — очистка данных покупателя;

Метод валидации:
- проверяет заполненность всех полей и корректность формата email и номера телефона.
`validate()`
  `isValid: boolean;`
  `errors:`
    `payment?: string;`
    `address?: string;`
    `email?: string;`
    `phone?: string;`

### Слой коммуникации

#### Класс WebLarekApi
Взаимодействие приложения с сервером.

Конструктор:
`constructor(api: IApi)` — принимает объект API для выполнения HTTP-запросов.

Поля:
`api: IApi` — объект для выполнения HTTP-запросов к серверу.

Методы:
`getProducts(): Promise<IProductsResponse>` - выполняет GET-запрос на эндпоинт /product/ и возвращает массив товаров;
`createOrder(data: IOrderRequest): Promise<IOrderResponse>` - выполняет POST-запрос на эндпоинт /order/ и отправляет данные заказа на сервер.

#### Интерфейс IWebLarekApi
Описывает контракт слоя коммуникации с сервером для инверсии зависимостей.

`getProducts(): Promise<IProductsResponse>` — запрос каталога товаров;
`createOrder(data: IOrderRequest): Promise<IOrderResponse>` — отправка заказа на сервер.

### Представление (View)

#### Интерфейсы View-компонентов
Используются Presenter для инверсии зависимостей. Каждый интерфейс описывает минимальный контракт компонента — метод `render` с конкретными данными, а также `open()`/`close()` там где нужно.

`IHeader` — контракт шапки сайта;
`IModal` — контракт модального окна (`render`, `open`, `close`);
`IGallery` — контракт каталога;
`IBasket` — контракт корзины;
`IOrderForm` — контракт формы оплаты и адреса;
`IContactsForm` — контракт формы контактов;
`ISuccess` — контракт окна успеха;
`ICardPreview` — контракт карточки превью товара.

#### Тип TCardCatalogFactory
Фабричная функция для создания карточек каталога. Принимает `ICardCatalogActions` (объект с `onClick`) и возвращает `ICardCatalog`.

#### Тип TCardBasketFactory
Фабричная функция для создания карточек корзины. Принимает `ICardBasketActions` (объект с `onDeleteClick`) и возвращает `ICardBasket`.

#### Класс Header
Отвечает за отображение шапки сайта.
Является дженериком `Component<IHeaderData>`, где `IHeaderData` — `{ counter: number }`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — принимает корневой DOM-элемент шапки (`.header`) и брокер событий.

Поля:
`basketButton: HTMLButtonElement` — кнопка открытия корзины (`.header__basket`);
`counterElement: HTMLElement` — элемент отображения счётчика (`.header__basket-counter`);
`events: IEvents` — брокер событий.

Методы:
`set counter(value: number): void` — устанавливает значение счётчика товаров в корзине.

#### Класс Modal
Оболочка модального окна. Всё содержимое модальных окон (карточка, корзина, формы) реализовано отдельными самостоятельными классами и вставляется через сеттер content.
Является дженериком `Component<IModalData>`, где `IModalData` — `{ content: HTMLElement }`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — принимает корневой DOM-элемент (`.modal`) и брокер событий.

Поля:
`closeButton: HTMLButtonElement` — кнопка закрытия (.modal__close);
`contentElement: HTMLElement` — контейнер вставляемого содержимого (.modal__content);
`events: IEvents` — брокер событий.

Методы:
`set content(value: HTMLElement): void` — заменяет содержимое модального окна на переданный элемент;
`open(): void` — показывает модальное окно (добавляет класс modal_active контейнеру);
`close(): void` — скрывает модальное окно (убирает класс modal_active).

#### Класс Gallery
Отвечает за отображение каталога товаров на главной странице.
Является дженериком `Component<IGalleryData>`, где `IGalleryData` — `{ catalog: HTMLElement[] }`.

Конструктор:
`constructor(container: HTMLElement)` — принимает корневой DOM-элемент каталога (`.gallery`).

Поля:
Отсутствуют.

Методы:
`set catalog(items: HTMLElement[]): void` — каталог карточек.

#### Класс Card (абстрактный родитель)
Общий родитель для трёх вариантов отображения карточки товара.
Является дженериком `Component<T>` — конкретный тип данных передаётся каждым классом-потомком отдельно. `title: string` и `price: number | null` — общие поля для всех потомков.

Конструктор:
`constructor(container: HTMLElement)` — принимает корневой DOM-элемент карточки.

Поля:
`titleElement: HTMLElement` — элемент названия товара (.card__title);
`priceElement: HTMLElement` — элемент цены товара (.card__price).

Методы:
`set title(value: string): void` — устанавливает название товара;
`set price(value: number | null): void` — устанавливает цену. Если null, отображает «Бесценно».

#### Класс CardCatalog (наследник Card)
Отображение карточки товара в каталоге на главной странице.
Является дженериком `Component<TCardCatalogData>`, где `TCardCatalogData = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>`.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardCatalogActions)` — принимает корневой DOM-элемент карточки и опциональный объект с обработчиком клика по карточке.

Поля:
`imageElement: HTMLImageElement` — изображение товара;
`categoryElement: HTMLElement` — категория товара.

Методы:
`set image(value: string): void` — устанавливает изображение;
`set category(value: string): void` — устанавливает текст категории.

#### Класс CardPreview (наследник Card)
Отображение карточки товара в модальном окне.
Является дженериком `Component<TCardPreviewData>`, где `TCardPreviewData = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'description'> & { buttonText: string; buttonDisabled: boolean }`.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardPreviewActions)` — принимает корневой DOM-элемент карточки и опциональный объект с обработчиком клика по кнопке.

Поля:
`imageElement: HTMLImageElement` — изображение товара;
`categoryElement: HTMLElement` — категория товара;
`descriptionElement: HTMLElement` — описание товара;
`buttonElement: HTMLButtonElement` — кнопка "Купить" и "Удалить из корзины".

Методы:
`set image(value: string): void` — устанавливает изображение;
`set category(value: string): void` — устанавливает текст категории;
`set description(value: string): void` — устанавливает текст описания;
`set buttonText(value: string): void` — устанавливает текст кнопки;
`set buttonDisabled(value: boolean): void` — блокирует или разблокирует кнопку.

#### Класс CardBasket (наследник Card)
Отображение товара строкой внутри корзины.
Является дженериком `Component<TCardBasketData>`, где `TCardBasketData = Pick<IProduct, 'title' | 'price'> & { index: number }`.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardBasketActions)` — принимает корневой DOM-элемент строки корзины и опциональный объект с обработчиком клика по кнопке удаления.

Поля:
`indexElement: HTMLElement` — порядковый номер товара в корзине;
`deleteButton: HTMLButtonElement` — кнопка удаления.

Методы:
`set index(value: number): void` — устанавливает порядковый номер.

#### Класс Form (абстрактный родитель)
Общий родитель для OrderForm и ContactsForm. Содержит функционал для всех форм оформления заказа.
Является дженериком `Component<T>` — конкретный тип данных передаётся каждым классом-потомком отдельно. `valid: boolean` и `errors: string` — общие поля для всех потомков.

Конструктор:
`constructor(container: HTMLFormElement, actions?: IFormActions)` — принимает корневой DOM-элемент формы и опциональный объект с обработчиками изменения полей и отправки формы.

Поля:
`submitButton: HTMLButtonElement` — кнопка отправки формы;
`errorsElement: HTMLElement` — вывод ошибок.

Методы:
`set valid(value: boolean): void` — включает/выключает кнопку отправки;
`set errors(value: string): void` — выводит текст ошибки валидации.

#### Класс OrderForm (наследник Form)
Первый шаг оформления заказа — способ оплаты и адрес доставки.
Является дженериком `Component<TOrderFormData>`, где `TOrderFormData = Pick<IBuyer, 'payment' | 'address'> & { valid: boolean; errors: string }`.

Конструктор:
`constructor(container: HTMLFormElement, actions?: IOrderFormActions)` — принимает корневой DOM-элемент формы и опциональный объект с обработчиками.

Поля:
`cardButton: HTMLButtonElement` — кнопка оплаты "Онлайн";
`cashButton: HTMLButtonElement` — кнопка оплаты "При получении";
`addressInput: HTMLInputElement` — поле адреса доставки.

Методы:
`set payment(value: TPayment): void` — переключает модификатор у выбранной кнопки оплаты;
`set address(value: string): void` — устанавливает значение поля адреса.

#### Класс ContactsForm (наследник Form)
Второй шаг оформления заказа — email и телефон покупателя.
Является дженериком `Component<TContactsFormData>`, где `TContactsFormData = Pick<IBuyer, 'email' | 'phone'> & { valid: boolean; errors: string }`.

Конструктор:
`constructor(container: HTMLFormElement, actions?: IFormActions)` — принимает корневой DOM-элемент формы и опциональный объект с обработчиками.

Поля:
`emailInput: HTMLInputElement` — поле email;
`phoneInput: HTMLInputElement` — поле телефона.

Методы:
`set email(value: string): void` — устанавливает значение поля email;
`set phone(value: string): void` — устанавливает значение поля телефона.

#### Класс Basket
Отображение содержимого корзины внутри модального окна.
Является дженериком `Component<IBasketData>`, где `IBasketData` — `{ items: HTMLElement[]; total: number }`.

Конструктор:
`constructor(container: HTMLElement, actions?: IBasketActions)` — принимает корневой DOM-элемент корзины и опциональный объект с обработчиком клика по кнопке оформления заказа.

Поля:
`listElement: HTMLElement` — список товаров;
`priceElement: HTMLElement` — итоговая сумма;
`buttonElement: HTMLButtonElement` — кнопка оформления заказа.

Методы:
`set items(value: HTMLElement[]): void` — выводит переданные карточки товаров. Если массив пуст, вместо списка выводит надпись "Корзина пуста" и блокирует кнопку оформления.
`set total(value: number): void` — устанавливает текст итоговой суммы.

#### Класс Success
Отображение окна подтверждения успешного оформления заказа.
Является дженериком `Component<ISuccessData>`, где `ISuccessData` — `{ total: number }`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — принимает корневой DOM-элемент (`.order-success`) и брокер событий.

Поля:
`descriptionElement: HTMLElement` — текст со списанной суммой;
`closeButton: HTMLButtonElement` — кнопка закрытия;
`events: IEvents` — брокер событий.

Методы:
`set total(value: number): void` — устанавливает текст "Списано N синапсов".

### События

#### События моделей:

`catalog:changed` — каталог товаров изменился;
`preview:changed` — выбран товар для просмотра;
`cart:changed` — изменилось содержимое корзины;
`order:changed` — изменились данные покупателя.

#### События представления:

`basket:open` — клик по корзине в шапке;
`modal:close` — закрытие модального окна;
`card:select` (товар) — клик по карточке в каталоге;
`card:toggleBasket` — клик "Купить" / "Удалить из корзины";
`card:remove` (id) — удаление товара из корзины;
`order:open` — клик "Оформить";
`order:input` (поле, значение) — ввод в форме оплаты/адреса;
`order:paymentSelect` (способ оплаты) — выбор способа оплаты;
`order:submit` — переход ко второй форме;
`contacts:input` (поле, значение) — ввод в форме контактов;
`contacts:submit` — отправка заказа.

### Презентер

Презентер реализован отдельным классом `Presenter`. Использует инверсию зависимостей. Карточки каталога и корзины создаются через фабричные функции (`TCardCatalogFactory`, `TCardBasketFactory`). Все объекты создаются и связываются между собой в `main.ts`(точка сборки)

Презентер только подписывается на события (`events.on`) — он не генерирует события самостоятельно. Каждый обработчик реализует один из двух сценариев:
- вызывает метод модели для изменения данных (в ответ на действие пользователя, пришедшее от View);
- вызывает метод `render`/`open`/`close` у компонента представления (только в ответ на событие об изменении данных в модели, либо при открытии модального окна).