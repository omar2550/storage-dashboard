import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { useToast } from "./useToast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المنتج",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-sales"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-sales"] });

      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
        variant: "destructive",
      });
    },
  });
};
