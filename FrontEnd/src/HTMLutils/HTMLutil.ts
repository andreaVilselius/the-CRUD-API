import { Order } from "../Models/Order";

import {
  addProductToOrder,
  getOrders,
  removeOrder,
  removeProductFromOrder,
  updateOrder,
  updateProductRequest,
} from "../services/orderService";

export const createHTML = (orders: Order[]) => {
  const ul = document.getElementById("orders");
  if (!ul) return;
  ul.innerHTML = "";
  orders.forEach((order) => {
    const infoDiv = document.createElement("div");
    infoDiv.className = "infoDiv";

    const orderInfoDiv = document.createElement("div");
    orderInfoDiv.className = "orderInfoDiv";

    const removebtn = document.createElement("button");
    removebtn.innerHTML = "radera beställning";
    const changebtn = document.createElement("button");
    changebtn.innerHTML = "uppdatera beställning";

    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const span = document.createElement("span");

    h3.innerHTML = "Namn: " + order.name;
    p.innerHTML = "Adress: " + order.address;
    span.innerHTML = "Id: " + order.id.toString();

    orderInfoDiv?.appendChild(h3);
    orderInfoDiv?.appendChild(p);
    orderInfoDiv?.appendChild(span);
    infoDiv?.appendChild(orderInfoDiv);
    infoDiv?.appendChild(changebtn);
    infoDiv?.appendChild(removebtn);

    //remove order
    removebtn.addEventListener("click", async () => {
      const success = await removeOrder(order.id);
      if (success) {
        const orders = await getOrders();

        createHTML(orders);
      } else {
        console.log("not able to delete order");
      }
    });

    const formUl = document.createElement("ul");

    // add products
    const productForm = document.createElement("form");
    const fAmountOfProducts = document.createElement("input");
    fAmountOfProducts.type = "text";
    fAmountOfProducts.placeholder = " 5 ";
    const fProductName = document.createElement("input");
    fProductName.type = "text";
    fProductName.placeholder = "byxa";
    const fProductPrice = document.createElement("input");
    fProductPrice.type = "text";
    fProductPrice.placeholder = "50";
    const addProductsBtn = document.createElement("button");
    addProductsBtn.type = "submit";
    addProductsBtn.innerHTML = "lägg till produkt";

    productForm.appendChild(fAmountOfProducts);
    productForm.appendChild(fProductName);
    productForm.appendChild(fProductPrice);
    productForm.appendChild(addProductsBtn);
    formUl.appendChild(productForm);

    order.orderItems.forEach((item) => {
      const productLi = document.createElement("li");
      productLi.innerHTML = "";
      fAmountOfProducts.value = item.nrOfProducts.toString();
      fProductName.value = item.product.name;
      fProductPrice.value = item.product.price.toString();

      const removeProductBtn = document.createElement("button");
      removeProductBtn.innerHTML = "ta bort produkt";
      const updateProductBtn = document.createElement("button");
      updateProductBtn.innerHTML = "updatera produkt";

      productLi.innerHTML =
        "Antal varor  :" +
        item.nrOfProducts.toString() +
        " st " +
        ", Typ av vara:  " +
        item.product.name +
        ", Pris per vara: " +
        item.product.price.toString();
      +" kr ";

      //remove product from order
      removeProductBtn.addEventListener("click", async () => {
        const productRemovedSuccess = await removeProductFromOrder(
          order.id,
          item.product.id,
        );
        if (productRemovedSuccess) {
          const orders = await getOrders();
          createHTML(orders);
        } else {
          console.log("not able to delete product");
        }
      });

      //update product

      const updateProductForm = document.createElement("form");

      const productNameInput = document.createElement("input");
      productNameInput.type = "text";
      productNameInput.placeholder = "skor";

      const priceInput = document.createElement("input");
      priceInput.type = "text";
      priceInput.placeholder = "300 kr";

      const saveUpdatedProductBtn = document.createElement("button");
      updateProductBtn.addEventListener("click", async () => {
        productNameInput.value = item.product.name;
        priceInput.value = item.product.price.toString();

        saveUpdatedProductBtn.type = "submit";
        saveUpdatedProductBtn.innerHTML = "spara";

        updateProductForm.appendChild(productNameInput);
        updateProductForm.appendChild(priceInput);
        updateProductForm.appendChild(saveUpdatedProductBtn);

        productNameInput.value = "";
        priceInput.value = "";
      });

      updateProductForm.addEventListener("submit", async (e) => {
        const theUpdatedProduct = {
          id: item.product.id,
          name: productNameInput.value,
          price: parseInt(priceInput.value),
        };

        e.preventDefault();
        const productUpdateSuccess = await updateProductRequest(
          order.id,
          item.product.id,
          theUpdatedProduct,
        );

        if (productUpdateSuccess) {
          const orders = await getOrders();
          createHTML(orders);
        }
      });

      fAmountOfProducts.value = "";
      fProductName.value = "";
      fProductPrice.value = "";

      productLi.appendChild(updateProductBtn);
      productLi.appendChild(removeProductBtn);
      productLi.appendChild(updateProductForm);
      formUl.appendChild(productLi);
      infoDiv.appendChild(formUl);
    });

    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newProduct = {
        product: {
          id: 0,
          name: fProductName.value,
          price: parseInt(fProductPrice.value) || 0,
        },
        nrOfProducts: parseInt(fAmountOfProducts.value) || 0,
      };

      const addProductsSuccess = await addProductToOrder(order.id, newProduct);

      if (addProductsSuccess) {
        const orders = await getOrders();

        createHTML(orders);
      }
    });

    //change order

    const form = document.createElement("form");

    const fName = document.createElement("input");
    const fAdress = document.createElement("input");

    changebtn.addEventListener("click", async () => {
      form.innerHTML = "";

      fName.type = "text";
      fName.placeholder = "Namn";
      fName.value = order.name;

      fAdress.type = "text";
      fAdress.placeholder = " Adress";
      fAdress.value = order.address;

      const subBtn = document.createElement("button");
      subBtn.type = "submit";
      subBtn.textContent = "spara";

      form.appendChild(fName);
      form.appendChild(fAdress);
      form.appendChild(subBtn);
      infoDiv.appendChild(form);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const success = await updateOrder(order.id, {
        ...order,
        name: fName.value,
        address: fAdress.value,
      });
      if (success) {
        const users = await getOrders();
        createHTML(users);
      }
    });

    infoDiv.appendChild(productForm);

    ul.appendChild(infoDiv);
  });
};
