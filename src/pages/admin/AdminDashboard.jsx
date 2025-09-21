import { useState, useEffect } from 'react';
import { ShoppingBag, Tag, TrendingUp, Users } from 'lucide-react';
import { productAPI, categoryAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalViews: 0,
    totalOrders: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAll(1),
        categoryAPI.getAll()
      ]);

      setStats({
        totalProducts: productsResponse.data.total || productsResponse.data.data.length,
        totalCategories: categoriesResponse.data.length,
        totalViews: 1250, // Mock data
        totalOrders: 45 // Mock data
      });

      setRecentProducts(productsResponse.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      name: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-green-500',
      change: '+5%'
    },
    // {
    //   name: 'Page Views',
    //   value: stats.totalViews.toLocaleString(),
    //   icon: TrendingUp,
    //   color: 'bg-purple-500',
    //   change: '+18%'
    // },
    // {
    //   name: 'Inquiries',
    //   value: stats.totalOrders,
    //   icon: Users,
    //   color: 'bg-orange-500',
    //   change: '+8%'
    // }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with Menggeris today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-lg object-cover"
                    src={product.images?.[0] ? `https://api-inventory.isavralabel.com/menggeris/uploads-menggaris/${product.images[0]}` : 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={product.name}
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Added {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No products found. Start by adding your first product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;