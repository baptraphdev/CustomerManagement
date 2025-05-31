import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Download 
} from 'lucide-react';

import { Customer } from '../types/customer';
import { getCustomerById, deleteCustomer } from '../services/customerService';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingFallback from '../components/LoadingFallback';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        if (data) {
          setCustomer(data);
        } else {
          toast.error('Customer not found');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast.error('Failed to load customer data');
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const exportCustomer = () => {
    if (!customer) return;
    
    const customerData = JSON.stringify(customer, null, 2);
    const blob = new Blob([customerData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-${customer.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingFallback />;
  }

  if (!customer) {
    return (
      <div className="text-center">
        <p className="mb-4 text-lg text-gray-600">Customer not found</p>
        <Link
          to="/customers"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportCustomer}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <Link
            to={`/customers/edit/${customer.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {customer.photoURL ? (
                <img
                  src={customer.photoURL}
                  alt={customer.name}
                  className="object-cover w-16 h-16 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 text-white bg-indigo-600 rounded-full">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="ml-5">
              <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500">Added on {formatDate(customer.createdAt)}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.email || 'Not provided'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.phone || 'Not provided'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <address className="not-italic">
                  {customer.address.street && (
                    <div>{customer.address.street}</div>
                  )}
                  {customer.address.city && customer.address.state && (
                    <div>
                      {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                    </div>
                  )}
                  {customer.address.country && (
                    <div>{customer.address.country}</div>
                  )}
                  {!customer.address.street && 
                   !customer.address.city && 
                   !customer.address.state && 
                   !customer.address.country && 
                   'No address provided'}
                </address>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(customer.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default CustomerDetails;