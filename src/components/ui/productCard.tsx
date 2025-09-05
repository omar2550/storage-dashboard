import { Trash2Icon, Package, Edit2Icon, ChartAreaIcon } from "lucide-react";

import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDeleteProduct } from "@/hooks/useDeleteProduct";

type FormData = {
  title: string;
  description: string;
  quantity: number;
  price: number;
  image_url: string | null;
  customSaleDate: string;
};

type EditingProduct = {
  id: string;
  quantity: number;
} | null;

type Prop = {
  img?: string;
  title: string;
  description?: string;
  isTop?: boolean;
  quantity: number;
  price: number;
  id: string;

  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  setEditingProduct?: React.Dispatch<React.SetStateAction<EditingProduct>>;
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenChart: (id: string, title: string) => void;
};

const ProductCard = ({
  img,
  title,
  description = "",
  isTop,
  quantity,
  price,
  id,
  setEditingProduct,
  setFormData,
  setIsDialogOpen,
  handleOpenChart,
}: Prop) => {
  const deleteProduct = useDeleteProduct();

  const handleEdit = () => {
    if (setEditingProduct && setFormData && setIsDialogOpen) {
      setEditingProduct({ id, quantity });

      setFormData({
        title: title,
        description: description || "",
        quantity,
        price,
        image_url: img || "",
        customSaleDate: "",
      });

      setIsDialogOpen(true);
    }
  };

  return (
    <Card
      className="min-h-[30rem] overflow-hidden flex flex-col justify-between"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <div>
        <CardHeader className="pb-2 h-[250px] overflow-hidden relative">
          {img ? (
            <img src={img} alt={title} className="h-full" />
          ) : (
            <div className="h-full bg-amber-500 flex justify-center items-center">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {isTop && (
            <div className="absolute top-0 right-0 bg-amber-400 p-1 text-amber-900">
              الاكثر مبيعا
            </div>
          )}
          <div
            className="absolute top-0 left-0 bg-amber-400 p-1 text-amber-900 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer"
            onClick={() => handleOpenChart(id, title)}
          >
            <ChartAreaIcon />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          <div className="text-lg font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </CardContent>
      </div>
      <CardFooter className="gap-4 flex flex-col">
        <div className="flex flex-wrap justify-between items-centre w-full font-medium text-amber-700">
          <h4 className="break-all">متوفر {quantity}</h4>
          <h4 className="text-end">ج.م {price}</h4>
        </div>
        <div className="w-full gap-2 flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon className="text-white" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-start">
                  هل أنت نتأكد انك تريد حذف هذا المنتج؟
                </AlertDialogTitle>
                <AlertDialogDescription className="text-start">
                  في حالة الحذف لن تستطيع الوصول لهذا المنتج مره اخرى
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>الغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteProduct.mutate(id)}>
                  {deleteProduct.isPending ? "جارٍ الحذف..." : "احذف"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="lg"
            className={`flex-1 z-30`}
            disabled={isTop}
            onClick={(e) => {
              if (!isTop) {
                handleEdit();
              }
              e.stopPropagation();
            }}
          >
            تعديل <Edit2Icon />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
