import { Link } from 'react-router-dom';
import { Edit, Trash2, User } from 'lucide-react';
import { Customer } from '../types/customer';

interface CustomerCardProps {
  customer: Customer;
  onDelete: (id: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onDelete }) => {
  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            {customer.photoURL ? (
              <img 
                src={customer.photoURL} 
                alt={customer.name} 
                className="object-cover w-12 h-12 rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-600 rounded-full">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {customer.address.city}, {customer.address.country}
          </p>
          <p className="text-sm text-gray-500">{customer.phone}</p>
        </div>
        
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
          <Link
            to={`/customers/${customer.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/customers/edit/${customer.id}`}
              className="p-1 text-blue-500 rounded-full hover:bg-blue-50"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button
              onClick={() => onDelete(customer.id)}
              className="p-1 text-red-500 rounded-full hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;