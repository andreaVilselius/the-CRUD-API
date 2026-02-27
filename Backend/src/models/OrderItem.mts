import { InferSchemaType, model, Schema } from "mongoose";
import { productSchema } from "./product.mjs";
import { OrderDTO } from "./OrderDTO.mjs";
import { OrderItemDTO } from "./OrderItemDTO.mjs";
import { productDTO } from "./ProductDTO.mjs";

export const orderItemSchema = new Schema({
  nrOfProducts: { type: Number },
  product: productSchema,
});

export const OrderItemModel = model("orderItem", orderItemSchema);

export type OrderItemFromDB = InferSchemaType<typeof orderItemSchema>;

export const convertDBOrderItemToDTO = (
  dbOrderItem: OrderItemFromDB,
): OrderItemDTO => {
  return {
    nrOfProducts: dbOrderItem.nrOfProducts,
    product: {
      id: dbOrderItem.product?.id,
      name: dbOrderItem.product?.name,
      price: dbOrderItem.product?.price,
    } satisfies productDTO,
  } satisfies OrderItemDTO;
};
