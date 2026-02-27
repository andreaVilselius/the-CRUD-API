import { createHTML } from "./HTMLutils/HTMLutil";

import {
  createOrder,
  getOrderById,
  getOrders,
  getOrdersSorted,
} from "./services/orderService";
import "./style.css";
//lägg till order
document
  .getElementById("addOrderForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = (document.getElementById("name") as HTMLInputElement)
      .value;
    const addressInput = (
      document.getElementById("address") as HTMLInputElement
    ).value;

    const order = await createOrder(nameInput, addressInput);
    console.log(order);
    const orders = await getOrders();
    createHTML(orders);
  });
//sök order
document
  .getElementById("searchOrder")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const IdInput = parseInt(
      (document.getElementById("id") as HTMLInputElement).value,
    );
    const idSearch = await getOrderById(IdInput);

    if (idSearch.length == 0) {
      console.log("no such id");
      return;
    }
    createHTML(idSearch);
  });

//hämta alla orders
document.getElementById("readOrders")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const orders = await getOrders();
  createHTML(orders);
});

//sortera ordrar
const sortOrderSelect = document.getElementById("sort");

sortOrderSelect?.addEventListener("change", async () => {
  const value = (sortOrderSelect as HTMLSelectElement).value;
  const sortedOrders = await getOrdersSorted(value);
  if (sortedOrders) createHTML(sortedOrders);
});

const orders = await getOrders();
createHTML(orders);
