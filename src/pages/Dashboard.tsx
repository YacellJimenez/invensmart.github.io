import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Plus, Minus } from "lucide-react";

interface DashboardData {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalProducts: number;
  totalStock: number;
  shippingData: Array<{ month: string; value: number }>;
  materialData: Array<{ name: string; value: number; color: string }>;
}

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  if (isLoading) {
    return (
      <div>
        <div className="bg-gray-300 px-6 py-3">
          <div className="flex items-center">
            <i className="fas fa-chart-pie text-gray-600 mr-2"></i>
            <span className="font-medium text-gray-700">Dashboard</span>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
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
          <i className="fas fa-chart-pie text-gray-600 mr-2"></i>
          <span className="font-medium text-gray-700">Dashboard</span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Card */}
          <Card className="bg-green-500 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Plus className="text-green-500 text-xl" />
                  </div>
                  <div className="text-3xl font-bold" data-testid="text-monthly-income">
                    {data?.monthlyIncome.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </div>
                  <div className="text-green-100 text-sm">ventas el mes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Expenses Card */}
          <Card className="bg-red-500 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Minus className="text-red-500 text-xl" />
                  </div>
                  <div className="text-3xl font-bold" data-testid="text-monthly-expenses">
                    {data?.monthlyExpenses.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </div>
                  <div className="text-red-100 text-sm">gastos el mes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Performance Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Shipping performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.shippingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="value" fill="#60A5FA" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Material Distribution Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Most amount material</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold" data-testid="text-total-material">
                  €1,908,000
                </div>
              </div>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.materialData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {data?.materialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {data?.materialData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
