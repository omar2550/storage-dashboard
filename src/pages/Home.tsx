import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { YearlyChart } from "@/components/chart/YearlyChart";
import { useAnalytics } from "@/hooks/useAnalytics";
import ProductCard from "@/components/ui/productCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductChart } from "@/components/chart/ProductChart";
// import { useAnalytics } from "@/hooks/useAnalytics";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartData, setChartData] = useState({ id: "", title: "" });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productSales, isProductSalesLoading } = useAnalytics();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المنتجات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChart = (id: string, title: string) => {
    setIsChartOpen(true);
    setChartData({ id, title });
  };

  const total = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const formattedTotal = new Intl.NumberFormat("ar-EG", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(total);

  return (
    <div className="min-h-screen space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المنتجات
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="w-15 h-8" /> : products.length}
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الكمية</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="w-15 h-8" />
              ) : (
                products.reduce((sum, products) => sum + products.quantity, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-bold flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="w-24 h-8" />
              ) : (
                <>
                  <span>{formattedTotal}</span>
                  <span className="text-muted-foreground text-lg">ج.م</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <YearlyChart />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>مخطط بياني</DialogTitle>
              <DialogDescription>
                يعرض مبيعات {chartData.title}
              </DialogDescription>
            </DialogHeader>
            <ProductChart productId={chartData.id} />
          </DialogContent>
        </Dialog>
        {isProductSalesLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full min-h-[30rem] bg-gray-200" />
            ))
          : productSales
              .slice(0, 3)
              .map((product) => (
                <ProductCard
                  key={product.productId}
                  img={product.productImg}
                  title={product.productName}
                  description={product.productDesc}
                  isTop={true}
                  quantity={product.productQuantity}
                  price={product.productPrice}
                  id={product.productId}
                  handleOpenChart={handleOpenChart}
                />
              ))}
      </div>
    </div>
  );
};

export default Home;
