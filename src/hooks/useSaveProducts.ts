import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { saveProduct, type FormDataProps } from "@/service/products";

type EditingProduct = { id: string; quantity: number };

export const useSaveProducts = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      formData,
      editingProduct,
    }: {
      formData: FormDataProps;
      editingProduct?: EditingProduct | null;
    }) => saveProduct(formData, editingProduct || undefined),
    onSuccess: (result) => {
      if (result.action === "created") {
        toast({
          title: "تم إضافة المنتج بنجاح",
          description: "تم حفظ المنتج الجديد",
        });
      } else if (result.action === "updated_with_sale" && result.saleDate) {
        toast({
          title: "تم تحديث المنتج وتسجيله في المبيعات",
          description: `تم بيع ${result.quantitySold} بتاريخ ${new Date(
            result.saleDate
          ).toLocaleDateString("ar")}`,
        });
      } else {
        toast({ title: "تم تحديث المنتج بنجاح" });
      }

      qc.invalidateQueries({ queryKey: ["product-sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast({
        title: "خطأ في حفظ المنتج",
        description: err.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });
};
