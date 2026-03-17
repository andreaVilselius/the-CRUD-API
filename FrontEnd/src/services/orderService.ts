import type { Order } from "../Models/Order";
import type { OrderItems } from "../Models/OrderItem";
import type { Product } from "../Models/Product";

//READ
export const getOrders = async () => {
  try {
    //"http://localhost:3000/orders/
    const response = await fetch("https://the-crud-api-backend.onrender.com/orders");
    const data: Order[] = await response.json();
    return data;
  } catch {
    throw new Error("Failed to fetch orders");
  }
};

export const getOrdersSorted = async (direction: string) => {
  try {
    const response = await fetch(
   //   "http://localhost:3000/orders?sort=" + direction,
      "https://the-crud-api-backend.onrender.com/orders?sort=" + direction,
    );
    const data: Order[] = await response.json();
    return data;
  } catch {
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderById = async (id: number) => {
  try {
    const response = await fetch(
     // "http://localhost:3000/orders/" + id
    "https://the-crud-api-backend.onrender.com/orders/"+id
    );
    const data: Order = await response.json();
    return [data];
  } catch {
    console.error("Could not fetch data from api");
    return [];
  }
};

export const getProductsByOrder = async (name: string) => {
  try {
    const response = await fetch(
     // "http://localhost:3000/orders/products/" + name,
       "https://the-crud-api-backend.onrender.com/orders/products/"+name,
    );
    const data: Product = await response.json();
    return data;
  } catch {
    console.error("Could not fetch data from api");
    return "";
  }
};

export const getProductByOrder = async (orderId: number, productId: number) => {
  try {
    const response = await fetch(
   //   "http://localhost:3000/orders/" + orderId + "/" + productId,
      "https://the-crud-api-backend.onrender.com/orders/"+ orderId + "/" + productId,
    );
    const data: OrderItems = await response.json();
    return data;
  } catch {
    console.error("Could not fetch data from api");
    return "";
  }
};

//CREATE

export const createOrder = async (name: string, address: string) => {
  try {
    const response = await fetch(
      //"http://localhost:3000/orders/"
     "https://the-crud-api-backend.onrender.com/orders/"
      , 
      {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: name, address: address }),
    });
    const data: Order = await response.json();
    return data;
  } catch {
    console.error("Could not fetch data from api");
    return "";
  }
};

//add product
export const addProductToOrder = async (
  orderId: number,
  orderItem: OrderItems,
) => {
  try {
    const response = await fetch(
      //"http://localhost:3000/orders/addproduct/" + orderId
       "https://the-crud-api-backend.onrender.com/orders/addproduct/" + orderId
      ,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderItem),
      },
    );
    const data: OrderItems = await response.json();
    return data;
  } catch {
    console.error("Could not fetch data from api");
    return "";
  }
};

//PUT

//update order
export const updateOrder = async (orderId: number, order: Order) => {
  try {
    const response = await fetch(
      
      //"http://localhost:3000/orders/" + orderId
      "https://the-crud-api-backend.onrender.com/orders/"+orderId
      
      , {
      method: "PUT",
      body: JSON.stringify(order),
      headers: {
        "content-type": "application/json",
      },
    });

    const data: Order = await response.json();
    return data;

    //return response.ok;
  } catch (error) {
    return false;
  }
};

//update product /:orderId/:productId"
export const updateProductRequest = async (
  orderId: number,
  productId: number,
  product: Product,
) => {
  try {
    const response = await fetch(
   //   "http://localhost:3000/orders/" + orderId + "/" + productId,
       "https://the-crud-api-backend.onrender.com/orders/"+orderId+ "/" + productId,
      {
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "content-type": "application/json",
        },
      },
    );
    const data: Product = await response.json();

    return data;
  } catch (error) {
    return false;
  }
};

//DELETE

export const removeOrder = async (orderId: number) => {
  try {
    const response = await fetch(
      
    //  "http://localhost:3000/orders/" + orderId, 
      "https://the-crud-api-backend.onrender.com/orders/"+orderId,
      
      {
      method: "DELETE",
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const removeProductFromOrder = async (
  orderId: number,
  productId: number,
) => {
  try {
    const response = await fetch(
    //  "http://localhost:3000/orders/" + orderId + "/" + productId,
         "https://the-crud-api-backend.onrender.com/orders/"+orderId + "/" + productId,
      {
        method: "DELETE",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
};

export const removeAllProductsFromOrder = async (orderId: number) => {
  try {
    const response = await fetch(
     // "http://localhost:3000/orders/products/" + orderId,
      "https://the-crud-api-backend.onrender.com/orders/products/"+orderId,
      {
        method: "DELETE",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
};
