import { supabase } from "@/supabase/client";

export type FormDataProps = {
  title: string;
  description?: string;
  quantity: number;
  price: number;
  image_url?: string | null;
  customSaleDate?: string;
};

export const saveProduct = async (
  formData: FormDataProps,
  editingProduct?: { id: string; quantity: number }
) => {
  if (editingProduct) {
    const prevQuantity = Number(editingProduct.quantity);
    const newQuantity = Number(formData.quantity);

    const quantityDecreased = prevQuantity > newQuantity;
    const quantitySold = quantityDecreased ? prevQuantity - newQuantity : 0;

    const { customSaleDate, ...productData } = formData;
    const { error: updateError } = await supabase
      .from("products")
      .update(productData)
      .eq("id", editingProduct.id);

    if (updateError) throw updateError;

    if (quantityDecreased && quantitySold > 0) {
      const saleDate = customSaleDate
        ? new Date(customSaleDate).toISOString()
        : new Date().toISOString();

      const { error: salesErr } = await supabase.from("sales").insert([
        {
          product_id: editingProduct.id,
          quantity_sold: quantitySold,
          unit_price: formData.price,
          total_amount: quantitySold * formData.price,
          sale_date: saleDate,
        },
      ]);

      if (salesErr) throw salesErr;

      return {
        action: "updated_with_sale",
        quantitySold,
        saleDate,
      };
    }
    return { action: "updated" };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customSaleDate, ...productData } = formData;
    const { error: insertErr } = await supabase
      .from("products")
      .insert([productData]);

    if (insertErr) throw insertErr;

    return { action: "created" };
  }
};
