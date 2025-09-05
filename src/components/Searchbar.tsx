import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useAnalytics } from "@/hooks/useAnalytics";
import ProductCard from "./ui/productCard";
import { Label } from "./ui/label";
import { Search } from "lucide-react";

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
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  setEditingProduct?: React.Dispatch<React.SetStateAction<EditingProduct>>;
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenChart: (id: string, title: string) => void;
};

const Searchbar = ({
  setFormData,
  setIsDialogOpen,
  setEditingProduct,
  handleOpenChart,
}: Prop) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);

  const { products } = useAnalytics();

  const filteredProducts = products.filter((product) => {
    if (search.length > 0) {
      return product.title.toLowerCase().includes(search.toLowerCase());
    }
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | PointerEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFilter(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div className="relative h-10" ref={searchRef}>
      <Label className="border rounded-xl pe-2 overflow-hidden">
        <Input
          type="text"
          className="h-full w-full focus-visible:ring-0 focus-visible:transparent focus-visible:ring-offset-0 rounded-none"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (e.target.value.length > 0) {
              setFilter(true);
            } else {
              setFilter(false);
            }
          }}
        />
        <Search size={20} className="cursor-pointer" />
      </Label>
      {filter && (
        <div
          className={`grid grid-cols-1 space-y-6 min-15 max-h-[33rem] rounded-xl overflow-x-auto mt-6 absolute top-5 left-1/2 -translate-x-1/2 bg-gray-200 shadow-2xl z-20 p-3 w-full`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
            ))
          ) : (
            <p className="text-gray-500">لا يوجد منتجات مطابقة</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
