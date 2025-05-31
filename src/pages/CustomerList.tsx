import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Search, X } from 'lucide-react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

import { Customer } from '../types/customer';
import { getPaginatedCustomers, deleteCustomer, searchCustomers } from '../services/customerService';
import CustomerCard from '../components/CustomerCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingFallback from '../components/LoadingFallback';

const PAGE_SIZE = 9;

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (newSearch = false) => {
    if (newSearch) {
      setCustomers([]);
      setLastDoc(null);
    }
    
    setLoading(true);
    
    try {
      const { customers: newCustomers, lastDoc: newLastDoc } = await getPaginatedCustomers(
        PAGE_SIZE,
        newSearch ? null : lastDoc
      );
      
      if (newSearch) {
        setCustomers(newCustomers);
      } else {
        // Ensure no duplicates when adding new customers
        const uniqueCustomers = [...customers];
        newCustomers.forEach(newCustomer => {
          if (!uniqueCustomers.some(c => c.id === newCustomer.id)) {
            uniqueCustomers.push(newCustomer);
          }
        });
        setCustomers(uniqueCustomers);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(newCustomers.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      loadCustomers(true);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    
    try {
      const results = await searchCustomers(searchTerm);
      // Ensure unique results
      const uniqueResults = results.filter((customer, index, self) =>
        index === self.findIndex(c => c.id === customer.id)
      );
      setCustomers(uniqueResults);
      setHasMore(false);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    loadCustomers(true);
  };

  const confirmDelete = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      await deleteCustomer(customerToDelete);
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete));
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search customers..."
              className="block w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
          
          <Link
            to="/customers/add"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Link>
        </div>
      </div>

      {isSearching && (
        <div className="mb-4 text-sm text-gray-500">
          Search results for: <span className="font-medium">{searchTerm}</span>
          <button
            onClick={clearSearch}
            className="ml-2 text-indigo-600 hover:text-indigo-800"
          >
            Clear
          </button>
        </div>
      )}

      {loading && customers.length === 0 ? (
        <LoadingFallback />
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 mb-4 text-indigo-600 bg-indigo-100 rounded-full">
            <UserPlus className="w-8 h-8" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mb-6 text-gray-500">
            {isSearching
              ? `No results found for "${searchTerm}"`
              : "You haven't added any customers yet."}
          </p>
          <Link
            to="/customers/add"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add your first customer
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onDelete={confirmDelete}
              />
            ))}
          </div>

          {loading && (
            <div className="py-4 mt-6 text-center">
              <div className="inline-block w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}

          {!isSearching && hasMore && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => loadCustomers()}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

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

export default CustomerList;