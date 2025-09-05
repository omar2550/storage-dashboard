import { supabase } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("authorized_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!user,
  });
  return { profile, isProfileLoading };
};
