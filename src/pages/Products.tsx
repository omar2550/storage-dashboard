import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ui/productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useSaveProducts } from "@/hooks/useSaveProducts";
import { useState, type ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/supabase/client";
import { ProductChart } from "@/components/chart/ProductChart";
import Searchbar from "@/components/Searchbar";

const Products = () => {
  const { products, isProductsLoading } = useAnalytics();

  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    quantity: number;
  } | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    quantity: number;
    price: number;
    image_url: string | null;
    customSaleDate: string;
  }>({
    title: "",
    description: "",
    quantity: 0,
    price: 0,
    image_url: null,
    customSaleDate: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartData, setChartData] = useState<{
    id: string;
    title: string;
  }>({
    id: "",
    title: "",
  });

  const [getImg, setGetImg] = useState<File | null>(null);

  const saveMutation = useSaveProducts();

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let image: string | null = null;

    if (getImg) {
      image = await uploadImage(getImg);
    }

    const finalFormData = { ...formData, image_url: image };

    saveMutation.mutate(
      {
        formData: finalFormData,
        editingProduct,
      },
      {
        onSuccess: () => {
          setEditingProduct(null);
          setIsDialogOpen(false);
          setFormData({
            title: "",
            description: "",
            quantity: 0,
            price: 0,
            image_url: null,
            customSaleDate: "",
          });
        },
      }
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGetImg(e.target.files[0]);
    }
  };

  const handleOpenChart = (id: string, title: string) => {
    setIsChartOpen(true);
    setChartData({ id, title });
  };

  return (
    <div className="">
      <Dialog
        open={isDialogOpen}
        modal
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setEditingProduct(null);
          } else {
            setIsDialogOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "قم بتعديل بيانات المنتج"
                : "أدخل بيانات المنتج الجديد"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">اسم المنتج</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                className=""
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">الكمية</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">ارفع الصورة</Label>
              <Input
                id="image_url"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                dir="ltr"
              />
            </div>
            {editingProduct && editingProduct.quantity > formData.quantity && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-md">
                <div className="text-sm text-muted-foreground mb-2">
                  📉 تنبيه: الكمية انخفضت من {editingProduct.quantity} إلى{" "}
                  {formData.quantity}
                  <br />
                  سيتم تسجيل بيع {editingProduct.quantity -
                    formData.quantity}{" "}
                  قطعة
                </div>
                <Label htmlFor="customSaleDate">تاريخ العملية (اختياري)</Label>
                <Input
                  id="customSaleDate"
                  type="datetime-local"
                  value={formData.customSaleDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customSaleDate: e.target.value,
                    })
                  }
                  placeholder="اتركه فارغاً للتاريخ الحالي"
                />
                <div className="text-xs text-muted-foreground">
                  إذا تركت هذا الحقل فارغاً، سيتم استخدام التاريخ والوقت الحالي
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? "جارٍ الحفظ..."
                  : editingProduct
                  ? "تحديث المنتج"
                  : "إضافة المنتج"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saveMutation.isPending}
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isChartOpen}
        modal
        onOpenChange={(open) => {
          if (!open) {
            setIsChartOpen(false);
            setEditingProduct(null);
          } else {
            setIsChartOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>مخطط بياني</DialogTitle>
            <DialogDescription>يعرض مبيعات {chartData.title}</DialogDescription>
          </DialogHeader>
          <ProductChart productId={chartData.id} />
        </DialogContent>
      </Dialog>
      <Card className="p-6">
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">المنتجات</h3>
            <p className="text-sm text-muted-foreground">
              قائمة جميع المنتجات المتاحة في المخزن
            </p>
          </div>
          <Searchbar
            setFormData={setFormData}
            setEditingProduct={setEditingProduct}
            setIsDialogOpen={setIsDialogOpen}
            handleOpenChart={handleOpenChart}
          />
          <Button
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                quantity: 0,
                price: 0,
                image_url: null,
                customSaleDate: "",
              });
              setEditingProduct(null);
              setIsDialogOpen(true);
            }}
          >
            اضافة محتوى جديد <Plus />
          </Button>
        </CardContent>
      </Card>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {isProductsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full min-h-[30rem] bg-gray-200"
                />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  img={product.image_url}
                  title={product.title}
                  description={product.description}
                  quantity={product.quantity}
                  price={product.price}
                  id={product.id}
                  setFormData={setFormData}
                  setIsDialogOpen={setIsDialogOpen}
                  setEditingProduct={setEditingProduct}
                  handleOpenChart={handleOpenChart}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
