import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Report } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChartBar, FileText, Download, Trash2 } from "lucide-react";

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-01-31");
  const { toast } = useToast();

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const reportData = {
        type: "Inventario General",
        description: "Reporte mensual de inventario",
        dateFrom: new Date(dateFrom).toISOString(),
        dateTo: new Date(dateTo).toISOString(),
        data: JSON.stringify({
          totalProducts: 150,
          totalValue: 25000,
          lowStockItems: 5,
        }),
      };
      
      const response = await apiRequest("POST", "/api/reports", reportData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Reporte generado",
        description: "El reporte se ha generado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Reporte eliminado",
        description: "El reporte se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el reporte",
        variant: "destructive",
      });
    },
  });

  const handleExportReport = () => {
    if (!reports || reports.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay reportes para exportar",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const csvContent = [
      ['Fecha de generación', 'Tipo de reporte', 'Descripción'],
      ...reports.map(report => [
        new Date(report.createdAt!).toLocaleDateString('es-ES'),
        report.type,
        report.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reportes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exportación exitosa",
      description: "El reporte se ha descargado como CSV",
    });
  };

  const handleDeleteAllReports = async () => {
    if (!reports || reports.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay reportes para eliminar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete all reports one by one
      for (const report of reports) {
        await apiRequest("DELETE", `/api/reports/${report.id}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Reportes eliminados",
        description: "Todos los reportes han sido eliminados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron eliminar todos los reportes",
        variant: "destructive",
      });
    }
  };

  // Mock data for charts
  const bestSellingData = [
    { name: "Cemento", value: 85 },
    { name: "Stickers", value: 70 },
    { name: "Bags", value: 55 },
    { name: "Box", value: 40 },
    { name: "Others", value: 30 },
  ];

  const monthlyMovementsData = [
    { month: "Janeiro", entradas: 20, salidas: 15 },
    { month: "Febrero", entradas: 35, salidas: 25 },
    { month: "Marzo", entradas: 40, salidas: 35 },
    { month: "Abril", entradas: 30, salidas: 25 },
    { month: "Mayo", entradas: 45, salidas: 40 },
    { month: "Junio", entradas: 50, salidas: 35 },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="bg-gray-300 px-6 py-3">
          <div className="flex items-center">
            <ChartBar className="text-gray-600 mr-2 w-4 h-4" />
            <span className="font-medium text-gray-700">Reportes</span>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-300 px-6 py-3">
        <div className="flex items-center">
          <ChartBar className="text-gray-600 mr-2 w-4 h-4" />
          <span className="font-medium text-gray-700">Reportes</span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Date Range and Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Desde:</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm"
              data-testid="input-date-from"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Hasta:</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm"
              data-testid="input-date-to"
            />
          </div>
          <Button 
            className="btn-blue font-medium" 
            onClick={() => generateReportMutation.mutate()}
            disabled={generateReportMutation.isPending}
            data-testid="button-generate-report"
          >
            Generar Reporte
          </Button>
          <Button 
            className="btn-purple font-medium" 
            onClick={handleExportReport}
            data-testid="button-export-report"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar reporte
          </Button>
          <Button 
            className="btn-red font-medium" 
            onClick={handleDeleteAllReports}
            data-testid="button-delete-report"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Borrar Reporte
          </Button>
        </div>

        {/* Reports Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-gray-800">Historial de Reportes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 font-medium text-sm">
                <div>Fecha de generación</div>
                <div>Tipo de reporte</div>
                <div>Descripción</div>
              </div>
              
              {reports?.map((report, index) => (
                <div 
                  key={report.id} 
                  className={`grid grid-cols-3 gap-4 px-4 py-3 hover:bg-gray-50 ${
                    index % 2 === 1 ? 'bg-gray-50' : ''
                  }`}
                  data-testid={`row-report-${report.id}`}
                >
                  <div className="text-sm text-gray-600" data-testid={`text-date-${report.id}`}>
                    {new Date(report.createdAt!).toLocaleDateString('es-ES')} {new Date(report.createdAt!).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-600" data-testid={`text-type-${report.id}`}>
                    {report.type}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-between" data-testid={`text-description-${report.id}`}>
                    <span>{report.description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReportMutation.mutate(report.id)}
                      disabled={deleteReportMutation.isPending}
                      data-testid={`button-delete-report-${report.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {reports?.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No hay reportes generados
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Selling Products Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Productos más vendidos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={bestSellingData} 
                    layout="horizontal" 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Bar dataKey="value" fill="#60A5FA" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Monthly Movements Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Movimientos por mes</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyMovementsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="entradas" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="salidas" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      dot={{ fill: "#EF4444" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>entradas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span>salidas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
