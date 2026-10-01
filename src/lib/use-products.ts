import { queryOptions, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/products.functions";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

export function useProducts() {
  return useQuery(productsQuery);
}
