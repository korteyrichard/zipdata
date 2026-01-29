import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { PageProps, User } from '@/types';

interface Product {
  id: number;
  name: string;
  network: string;
  amount: number;
}

interface Order {
  id: number;
  user: User;
  total_amount: number;
  status: string;
}

interface Transaction {
  id: number;
  user: User;
  amount: number;
  type: string;
}

interface AdminDashboardProps extends PageProps {
  usersCount: number;
  productsCount: number;
  ordersCount: number;
  transactionsCount: number;
  todayUsersCount: number;
  todayOrdersCount: number;
  todayTransactionsCount: number;
  orderPusherEnabled: boolean;
  topUsers: Array<{
    id: number;
    name: string;
    email: string;
    wallet_balance: number;
  }>;
}

const StatCard = ({ title, value, gradient }: { title: string; value: number | string; gradient: string }) => (
  <div className={`${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20`}>
    <h3 className="text-sm font-medium text-white/90">{title}</h3>
    <p className="text-3xl font-bold text-white mt-2">{value}</p>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  usersCount,
  productsCount,
  ordersCount,
  transactionsCount,
  todayUsersCount,
  todayOrdersCount,
  todayTransactionsCount,
  orderPusherEnabled,
  topUsers,
}) => {
  const { auth } = usePage<AdminDashboardProps>().props;

  const toggleOrderPusher = () => {
    router.post('/admin/toggle-order-pusher', {
      enabled: !orderPusherEnabled
    });
  };

  return (
    <AdminLayout
      user={auth?.user}
      header={<h2 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>}
    >
      <Head title="Admin Dashboard" />

      <div className="p-6 space-y-10">
        {/* Summary Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Overall Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={usersCount} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
            <StatCard title="Total Products" value={productsCount} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <StatCard title="Total Orders" value={ordersCount} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
            <StatCard title="Total Transactions" value={transactionsCount} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
          </div>
        </section>

        {/* Today Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Today's Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="New Users Today" value={todayUsersCount} gradient="bg-gradient-to-br from-cyan-500 to-cyan-600" />
            <StatCard title="Orders Today" value={todayOrdersCount} gradient="bg-gradient-to-br from-pink-500 to-pink-600" />
            <StatCard title="Transactions Today" value={todayTransactionsCount} gradient="bg-gradient-to-br from-indigo-500 to-indigo-600" />
          </div>
        </section>

        {/* Order Pusher Controls */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">System Controls</h3>
          <div className="space-y-4">
            {/* Order Pusher */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-slate-800 dark:text-white">Order Pusher</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-300">
                    {orderPusherEnabled ? 'Orders are being pushed to API for all networks' : 'Order pushing is disabled'}
                  </p>
                </div>
                <button
                  onClick={toggleOrderPusher}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    orderPusherEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      orderPusherEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Top 10 Users by Wallet Balance */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Top 10 Users by Wallet Balance</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Wallet Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          GHS {Number(user.wallet_balance).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
