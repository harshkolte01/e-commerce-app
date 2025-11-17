import Link from 'next/link';

interface Order {
  id: number;
  total: number;
  createdAt: string;
  itemCount: number;
}

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.id}
              </h3>
              <p className="text-gray-600">
                {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">₹{Number(order.total).toFixed(2)}</p>
              <Link
                href={`/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}