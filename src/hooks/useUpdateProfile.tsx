import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { supabase } from "@/supabase/client";

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: string;
      userData: object;
    }) => {
      const { error } = await supabase
        .from("authorized_users")
        .update(userData)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      toast({
        title: "تم حفظ البيانات بنجاح",
      });
      qc.invalidateQueries({ queryKey: ["profile", variables.userId] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حفظ البيانات",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
