import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Package, LogIn, User } from "lucide-react";

const Welcome = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              نظام إدارة المخزن
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نظام شامل لإدارة المنتجات والمخزون بسهولة وفعالية. تحكم في منتجاتك
            وتتبع الكميات والأسعار
          </p>

          {!user && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="gap-2"
              >
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </Button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardHeader>
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>إدارة المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                أضف وعدّل واحذف المنتجات بسهولة مع تتبع جميع التفاصيل المهمة
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>تتبع المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                راقب كميات المنتجات وتلقى تنبيهات عند انخفاض المخزون
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>تقارير شاملة</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                احصل على تقارير مفصلة عن المخزون والقيمة الإجمالية للمنتجات
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="text-center bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ابدأ الآن مجاناً
            </h2>
            <p className="text-muted-foreground mb-6">
              انضم إلى آلاف المستخدمين الذين يثقون بنظامنا لإدارة مخازنهم
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="gap-2"
            >
              <User className="h-5 w-5" />
              إنشاء حساب جديد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
