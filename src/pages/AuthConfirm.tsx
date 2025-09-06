import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/supabase/client";

const AuthConfirm = () => {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthConfirm = async () => {
      try {
        // Get the URL fragment (hash)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Set the session using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error confirming auth:", error);
            toast({
              title: "خطأ في التحقق",
              description: error.message,
              variant: "destructive",
            });
          } else if (data.session) {
            console.log("Auth confirmed successfully:", data);
            setConfirmed(true);
            toast({
              title: "تم التحقق بنجاح!",
              description: "تم تأكيد حسابك بنجاح",
            });

            // Redirect to home page after 2 seconds
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } else {
          console.log("No auth tokens found in URL");
          toast({
            title: "رابط غير صالح",
            description: "رابط التحقق غير صالح أو منتهي الصلاحية",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error processing auth confirmation:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء معالجة التحقق",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleAuthConfirm();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>جارٍ التحقق...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              يرجى الانتظار أثناء تأكيد حسابك
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{confirmed ? "تم التحقق بنجاح!" : "فشل التحقق"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {confirmed ? (
            <>
              <p className="text-green-600">
                تم تأكيد حسابك بنجاح. سيتم توجيهك إلى الصفحة الرئيسية خلال
                ثواني...
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                الذهاب للصفحة الرئيسية
              </Button>
            </>
          ) : (
            <>
              <p className="text-destructive">
                فشل في تأكيد الحساب. الرابط قد يكون منتهي الصلاحية.
              </p>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                العودة للصفحة الرئيسية
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;
