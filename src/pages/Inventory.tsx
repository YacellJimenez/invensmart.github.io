import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Inventory as InventoryType, Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import InventoryForm from "../components/InventoryForm";
import { Plus, Download, Search, ArrowLeft, ClipboardList } from "lucide-react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const { data: inventory, isLoading: inventoryLoading } = useQuery<InventoryType[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (item: any) => {
      const response = await apiRequest("POST", "/api/inventory", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setShowAddForm(false);
      toast({
        title: "Item agregado",
        description: "El item se ha agregado al inventario exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar el item al inventario",
        variant: "destructive",
      });
    },
  });

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || 'Producto no encontrado';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      disponible: { label: "Disponible", className: "status-disponible" },
      bajo_stock: { label: "Bajo Stock", className: "status-bajo_stock" },
      agotado: { label: "Agotado", className: "status-agotado" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disponible;
    
    return (
      <Badge className={`status-badge ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const filteredInventory = inventory?.filter(item => {
    const productName = getProductName(item.productId).toLowerCase();
    return productName.includes(searchTerm.toLowerCase()) || 
           item.unit.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (inventoryLoading) {
    return (
      <div>
        <div className="bg-gray-300 px-6 py-3">
          <div className="flex items-center">
            <ClipboardList className="text-gray-600 mr-2 w-4 h-4" />
            <span className="font-medium text-gray-700">Inventario</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <Skeleton className="h-10 flex-1 min-w-64" />
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
          <ClipboardList className="text-gray-600 mr-2 w-4 h-4" />
          <span className="font-medium text-gray-700">Inventario</span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Search and Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Búsqueda rápida"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="btn-green font-medium" data-testid="button-new-entry">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Entrada de Inventario</DialogTitle>
              </DialogHeader>
              <InventoryForm
                products={products || []}
                onSubmit={(item) => createMutation.mutate(item)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>

          <Button className="btn-blue font-medium" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="btn-purple font-medium" data-testid="button-advanced-search">
            <Search className="w-4 h-4 mr-2" />
            Búsqueda Avanzada
          </Button>
          <Button className="btn-red font-medium" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="bg-blue-500 text-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium">
                <div className="col-span-1">
                  <Plus className="text-white w-4 h-4" />
                </div>
                <div className="col-span-2">Item</div>
                <div className="col-span-2">Unidad</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1"></div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredInventory?.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 ${
                    index % 2 === 1 ? 'bg-gray-50' : ''
                  }`}
                  data-testid={`row-inventory-${item.id}`}
                >
                  <div className="col-span-1">
                    <ClipboardList className="text-blue-400 w-4 h-4" />
                  </div>
                  <div className="col-span-2 text-sm font-medium" data-testid={`text-item-${item.id}`}>
                    {getProductName(item.productId)}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-unit-${item.id}`}>
                    {item.unit}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-stock-${item.id}`}>
                    {item.stock}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-date-${item.id}`}>
                    {new Date(item.updatedAt!).toLocaleDateString('es-ES')}
                  </div>
                  <div className="col-span-2" data-testid={`status-${item.id}`}>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="col-span-1"></div>
                </div>
              ))}
              
              {filteredInventory?.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? "No se encontraron items que coincidan con la búsqueda" : "No hay items en inventario"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
