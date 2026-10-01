import { createServerFn } from "@tanstack/react-start";
import { getLiveProducts } from "@/lib/products.server";

export const getProducts = createServerFn({ method: "GET" }).handler(() => getLiveProducts());
