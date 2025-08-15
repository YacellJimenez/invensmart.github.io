import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMovementSchema, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

type FormData = z.infer<typeof insertMovementSchema>;

interface MovementFormProps {
  products: Product[];
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function MovementForm({ products, onSubmit, isLoading }: MovementFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertMovementSchema),
    defaultValues: {
      ref: "",
      productId: "",
      type: "entrada",
      quantity: 0,
      description: "",
      userId: "admin",
    },
  });

  const selectedProductId = watch("productId");
  const selectedType = watch("type");
  const quantity = watch("quantity");

  // Auto-generate reference
  const generateRef = () => {
    const timestamp = Date.now().toString().slice(-6);
    setValue("ref", `MOV${timestamp}`);
  };

  return (
    <form onSubmit={handleSubmit((data) => {
      // Ensure quantity is negative for salidas
      const adjustedQuantity = data.type === "salida" ? -Math.abs(data.quantity) : Math.abs(data.quantity);
      onSubmit({ ...data, quantity: adjustedQuantity });
    })} className="space-y-4">
      <div>
        <Label htmlFor="ref">Referencia</Label>
        <div className="flex gap-2">
          <Input
            id="ref"
            {...register("ref")}
            placeholder="MOV001"
            data-testid="input-ref"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={generateRef}
            data-testid="button-generate-ref"
          >
            Generar
          </Button>
        </div>
        {errors.ref && (
          <p className="text-sm text-red-600 mt-1">{errors.ref.message}</p>
        )}
      </div>

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
        <Label htmlFor="type">Tipo de Movimiento</Label>
        <Select
          value={selectedType}
          onValueChange={(value) => setValue("type", value as any)}
        >
          <SelectTrigger data-testid="select-type">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entrada">Entrada</SelectItem>
            <SelectItem value="salida">Salida</SelectItem>
            <SelectItem value="ajuste">Ajuste</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          type="number"
          {...register("quantity", { valueAsNumber: true })}
          placeholder="0"
          data-testid="input-quantity"
        />
        <p className="text-xs text-gray-500 mt-1">
          {selectedType === "salida" ? "Se registrará como cantidad negativa" : "Se registrará como cantidad positiva"}
        </p>
        {errors.quantity && (
          <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Descripción del movimiento..."
          rows={3}
          data-testid="input-description"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="userId">Usuario</Label>
        <Input
          id="userId"
          {...register("userId")}
          placeholder="admin"
          data-testid="input-user"
        />
        {errors.userId && (
          <p className="text-sm text-red-600 mt-1">{errors.userId.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !selectedProductId}
          className="btn-green flex-1"
          data-testid="button-submit"
        >
          {isLoading ? "Guardando..." : "Registrar Movimiento"}
        </Button>
      </div>
    </form>
  );
}
