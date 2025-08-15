import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInventorySchema, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

type FormData = z.infer<typeof insertInventorySchema>;

interface InventoryFormProps {
  products: Product[];
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function InventoryForm({ products, onSubmit, isLoading }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertInventorySchema),
    defaultValues: {
      productId: "",
      unit: "",
      stock: 0,
      status: "disponible",
    },
  });

  const selectedProductId = watch("productId");
  const stock = watch("stock");

  // Auto-calculate status based on stock
  const calculateStatus = (stockValue: number) => {
    if (stockValue === 0) return "agotado";
    if (stockValue <= 10) return "bajo_stock";
    return "disponible";
  };

  return (
    <form onSubmit={handleSubmit((data) => {
      const status = calculateStatus(data.stock);
      onSubmit({ ...data, status });
    })} className="space-y-4">
      <div>
        <Label htmlFor="productId">Producto</Label>
        <Select
          value={selectedProductId}
          onValueChange={(value) => setValue("productId", value)}
        >
          <SelectTrigger data-testid="select-product">
            <SelectValue placeholder="Seleccionar producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} ({product.ref})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && (
          <p className="text-sm text-red-600 mt-1">{errors.productId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="unit">Unidad de Medida</Label>
        <Input
          id="unit"
          {...register("unit")}
          placeholder="Unidades, Litros, Kilos..."
          data-testid="input-unit"
        />
        {errors.unit && (
          <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p>
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

      <div className="text-sm text-gray-600">
        <strong>Estado calculado:</strong> {
          stock === 0 ? "Agotado" : 
          stock <= 10 ? "Bajo Stock" : 
          "Disponible"
        }
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !selectedProductId}
          className="btn-green flex-1"
          data-testid="button-submit"
        >
          {isLoading ? "Guardando..." : "Agregar al Inventario"}
        </Button>
      </div>
    </form>
  );
}
