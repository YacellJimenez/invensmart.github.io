import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Movement, Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MovementForm from "../components/MovementForm";
import { Search, Truck, ClipboardList, Plus } from "lucide-react";

export default function Movements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const { data: movements, isLoading: movementsLoading } = useQuery<Movement[]>({
    queryKey: ["/api/movements"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (movement: any) => {
      const response = await apiRequest("POST", "/api/movements", movement);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddForm(false);
      toast({
        title: "Movimiento registrado",
        description: "El movimiento se ha registrado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el movimiento",
        variant: "destructive",
      });
    },
  });

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || 'Producto no encontrado';
  };

  const filteredMovements = movements?.filter(movement => {
    const productName = getProductName(movement.productId).toLowerCase();
    return productName.includes(searchTerm.toLowerCase()) || 
           movement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           movement.userId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (movementsLoading) {
    return (
      <div>
        <div className="bg-gray-300 px-6 py-3">
          <div className="flex items-center">
            <Truck className="text-gray-600 mr-2 w-4 h-4" />
            <span className="font-medium text-gray-700">Movimientos</span>
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
          <Truck className="text-gray-600 mr-2 w-4 h-4" />
          <span className="font-medium text-gray-700">Movimientos</span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Search and Filter Controls */}
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
              <Button className="btn-green font-medium" data-testid="button-new-movement">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento</DialogTitle>
              </DialogHeader>
              <MovementForm
                products={products || []}
                onSubmit={(movement) => createMutation.mutate(movement)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>

          <Button className="btn-green font-medium" data-testid="button-filter-type">
            Tipo [ todos ]
          </Button>
          <Button className="btn-blue font-medium" data-testid="button-filter-item">
            Item [ todos ]
          </Button>
          <Button className="btn-purple font-medium" data-testid="button-filter-date">
            Fecha [desde] [hasta]
          </Button>
          <Button className="btn-red font-medium" data-testid="button-clear">
            Limpiar
          </Button>
        </div>

        {/* Movements Table */}
        <Card>
          <CardContent className="p-0">
            <div className="bg-blue-500 text-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium">
                <div className="col-span-1">REF</div>
                <div className="col-span-3">Item</div>
                <div className="col-span-2">Cantidad</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-2">Usuario</div>
                <div className="col-span-2">Acciones</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredMovements?.map((movement, index) => (
                <div 
                  key={movement.id} 
                  className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 ${
                    index % 2 === 1 ? 'bg-gray-50' : ''
                  }`}
                  data-testid={`row-movement-${movement.id}`}
                >
                  <div className="col-span-1">
                    <ClipboardList className="text-blue-400 w-4 h-4" />
                  </div>
                  <div className="col-span-3 text-sm font-medium" data-testid={`text-item-${movement.id}`}>
                    {movement.description || getProductName(movement.productId)}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-quantity-${movement.id}`}>
                    <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-date-${movement.id}`}>
                    {new Date(movement.createdAt!).toLocaleDateString('es-ES')}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600" data-testid={`text-user-${movement.id}`}>
                    {movement.userId}
                  </div>
                  <div className="col-span-2">
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0"
                      data-testid={`button-details-${movement.id}`}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredMovements?.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? "No se encontraron movimientos que coincidan con la búsqueda" : "No hay movimientos registrados"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
