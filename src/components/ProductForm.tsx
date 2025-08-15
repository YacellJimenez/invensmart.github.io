import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

type FormData = z.infer<typeof insertProductSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function ProductForm({ product, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ? {
      ref: product.ref,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    } : {
      ref: "",
      name: "",
      category: "Categoria A",
      price: "",
      stock: 0,
    },
  });

  const selectedCategory = watch("category");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ref">Referencia</Label>
        <Input
          id="ref"
          {...register("ref")}
          placeholder="P001"
          data-testid="input-ref"
        />
        {errors.ref && (
          <p className="text-sm text-red-600 mt-1">{errors.ref.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Nombre del producto"
          data-testid="input-name"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue("category", value as any)}
        >
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Categoria A">Categoría A</SelectItem>
            <SelectItem value="Categoria B">Categoría B</SelectItem>
            <SelectItem value="Categoria C">Categoría C</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          {...register("price")}
          placeholder="99.99"
          step="0.01"
          data-testid="input-price"
        />
        {errors.price && (
          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          placeholder="0"
          data-testid="input-stock"
        />
        {errors.stock && (
          <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="btn-green flex-1"
          data-testid="button-submit"
        >
          {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"} Producto
        </Button>
      </div>
    </form>
  );
}
