import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, InsertProduct } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ProductForm from "../components/ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Filter, Eye, ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function Products() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      const response = await apiRequest("POST", "/api/products", product);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddForm(false);
      toast({
        title: "Producto creado",
        description: "El producto se ha creado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Partial<InsertProduct> }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, product);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (product: InsertProduct) => {
    createMutation.mutate(product);
  };

  const handleUpdate = (product: Partial<InsertProduct>) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, product });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="bg-gray-300 px-6 py-3">
          <div className="flex items-center">
            <i className="fas fa-box text-gray-600 mr-2"></i>
            <span className="font-medium text-gray-700">Productos</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-300 px-6 py-3">
        <div className="flex items-center">
          <i className="fas fa-box text-gray-600 mr-2"></i>
          <span className="font-medium text-gray-700">Productos</span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button 
                className="btn-green font-medium" 
                data-testid="button-add-product"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Producto</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleCreate}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>

          <Button className="btn-blue font-medium" data-testid="button-filter">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button className="btn-purple font-medium" data-testid="button-show-all">
            <Eye className="w-4 h-4 mr-2" />
            Mostrar Todo
          </Button>
          <Button className="btn-red font-medium" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="bg-blue-500 text-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium">
                <div className="col-span-2">REF</div>
                <div className="col-span-3">Nombre</div>
                <div className="col-span-2">Categoría</div>
                <div className="col-span-2">Precio</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-1">Acciones</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {products?.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 ${
                    index % 2 === 1 ? 'bg-gray-50' : ''
                  }`}
                  data-testid={`row-product-${product.id}`}
                >
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-ref-${product.id}`}>
                    {product.ref}
                  </div>
                  <div className="col-span-3 text-sm font-medium" data-testid={`text-name-${product.id}`}>
                    {product.name}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-category-${product.id}`}>
                    {product.category}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-price-${product.id}`}>
                    €{product.price}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-stock-${product.id}`}>
                    {product.stock}
                  </div>
                  <div className="col-span-1">
                    <div className="flex space-x-1">
                      <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                        <DialogTrigger asChild>
                          <button 
                            className="w-6 h-6 bg-green-100 rounded flex items-center justify-center hover:bg-green-200"
                            onClick={() => setEditingProduct(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="text-green-600 w-3 h-3" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            product={editingProduct || undefined}
                            onSubmit={handleUpdate}
                            isLoading={updateMutation.isPending}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <button 
                        className="w-6 h-6 bg-red-100 rounded flex items-center justify-center hover:bg-red-200"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${product.id}`}
                      >
                        <Trash2 className="text-red-600 w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {products?.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No hay productos registrados
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
