/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SalesData {
  productId: string;
  productName: string;
  productDesc?: string;
  productImg?: string;
  totalAmount: number;
  totalSold: number;
  productQuantity: number;
  productPrice: number;
  month: string;
}

interface MonthlySales {
  totalAmount: number;
  totalSold: number;
  month: string;
}

interface Sale {
  sale_date: string;
  quantity_sold: number;
  total_amount: number;
  product_id: {
    id: string;
    title: string;
    image_url: string;
    description: string;
    quantity: number;
    price: number;
  };
}

export const useAnalytics = () => {
  // 1) Product Sales
  const { data: productSales = [], isLoading: isProductSalesLoading } =
    useQuery<SalesData[]>({
      queryKey: ["product-sales"],
      queryFn: async (): Promise<SalesData[]> => {
        const { data, error } = (await supabase.from("sales").select(`
        sale_date,
        quantity_sold,
        total_amount,
        product_id (
          id,
          title,
          image_url,
          description,
          quantity,
          price
          )`)) as { data: Sale[]; error: any };

        if (error) throw error;

        const groupedData = data.reduce(
          (acc: Record<string, SalesData>, sale) => {
            const month = new Date(sale.sale_date).toISOString().slice(0, 10);
            const productId = sale.product_id.id;
            const productName = sale.product_id?.title ?? "Unknown";
            const productImg = sale.product_id.image_url ?? "";
            const productDesc = sale.product_id.description ?? "";
            const key = `${productId}-${month}`;

            if (!acc[key]) {
              acc[key] = {
                productId,
                productName,
                productDesc,
                productImg,
                totalAmount: 0,
                totalSold: 0,
                productQuantity: sale.product_id.quantity,
                productPrice: sale.product_id.price,
                month,
              };
            }

            acc[key].totalAmount += Number(sale.total_amount);
            acc[key].totalSold += sale.quantity_sold;
            return acc;
          },
          {}
        );
        return Object.values(groupedData).sort(
          (a, b) => b.totalSold - a.totalSold
        );
      },
    });

  // 2) Monthly Sales
  const { data: monthlySales = [], isLoading: isMonthlySalesLoading } =
    useQuery<MonthlySales[]>({
      queryKey: ["monthly-sales"],
      queryFn: async (): Promise<MonthlySales[]> => {
        const { data, error } = await supabase
          .from("sales")
          .select(`sale_date, total_amount, quantity_sold`);

        if (error) throw error;

        const groupedData = data.reduce(
          (acc: Record<string, MonthlySales>, sale) => {
            const month = new Date(sale.sale_date);
            const monthKey = `${month.getFullYear()}-${String(
              month.getMonth() + 1
            ).padStart(2, "0")}`;
            const monthName = month.toLocaleString("ar-SA", {
              month: "long",
              calendar: "gregory",
            });

            if (!acc[monthKey]) {
              acc[monthKey] = {
                month: monthName,
                totalAmount: 0,
                totalSold: 0,
              };
            }

            acc[monthKey].totalAmount += Number(sale.total_amount);
            acc[monthKey].totalSold += sale.quantity_sold;

            return acc;
          },
          {}
        );
        return Object.values(groupedData);
      },
    });

  // 3) Product
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) throw error;

      return data;
    },
  });

  return {
    productSales,
    isProductSalesLoading,
    monthlySales,
    isMonthlySalesLoading,
    products,
    isProductsLoading,
  };
};
