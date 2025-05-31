import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  PieChart, 
  UsersRound, 
  UserPlus, 
  ArrowRight 
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { getCustomerStatistics } from '../services/customerService';
import LoadingFallback from '../components/LoadingFallback';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8dd1e1'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    countryData: [] as { name: string; value: number }[]
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statistics = await getCustomerStatistics();
        setStats(statistics);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  // Generate some mock data for the last 7 days
  const generateDailyData = () => {
    const data = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      data.push({
        name: daysOfWeek[i],
        customers: Math.floor(Math.random() * 10) + 1,
      });
    }
    
    return data;
  };

  const dailyData = generateDailyData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/customers/add"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-md">
              <UsersRound className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-md">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">New Customers (30 days)</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.newCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="p-5 overflow-hidden transition-all duration-300 bg-white rounded-lg shadow hover:shadow-md">
          <Link to="/customers" className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-md">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">View All Customers</p>
                <p className="text-lg font-medium text-indigo-600">Manage List</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-500" />
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="p-5 bg-white rounded-lg shadow">
          <h2 className="flex items-center mb-4 text-lg font-medium text-gray-900">
            <BarChart className="w-5 h-5 mr-2 text-indigo-500" />
            New Customers (Last 7 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={dailyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="p-5 bg-white rounded-lg shadow">
          <h2 className="flex items-center mb-4 text-lg font-medium text-gray-900">
            <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
            Customers by Country
          </h2>
          <div className="h-64">
            {stats.countryData.length > 0 ? (
              <ResponsiveContainer width="100%\" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={stats.countryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;