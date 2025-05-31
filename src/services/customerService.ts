import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { db, storage } from '../firebase/config';
import { Customer, CustomerFormData } from '../types/customer';

const COLLECTION_NAME = 'customers';
const customersCollection = collection(db, COLLECTION_NAME);

// Upload customer photo to Firebase Storage
async function uploadCustomerPhoto(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `customer-photos/${fileName}`);
  
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Delete customer photo from Firebase Storage
async function deleteCustomerPhoto(photoURL: string): Promise<void> {
  try {
    const photoRef = ref(storage, photoURL);
    await deleteObject(photoRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}

// Create a new customer
export async function createCustomer(customerData: CustomerFormData): Promise<Customer> {
  let photoURL = null; // Initialize to null instead of undefined
  
  if (customerData.photo) {
    photoURL = await uploadCustomerPhoto(customerData.photo);
  }
  
  const timestamp = Date.now();
  const newCustomer: Omit<Customer, 'id'> = {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    photoURL,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  const docRef = await addDoc(customersCollection, newCustomer);
  return { id: docRef.id, ...newCustomer };
}

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  const querySnapshot = await getDocs(query(customersCollection, orderBy('createdAt', 'desc')));
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
}

// Get paginated customers
export async function getPaginatedCustomers(
  pageSize: number, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ customers: Customer[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  let customerQuery;
  
  if (lastDoc) {
    customerQuery = query(
      customersCollection,
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(pageSize)
    );
  } else {
    customerQuery = query(
      customersCollection,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
  }
  
  const querySnapshot = await getDocs(customerQuery);
  const customers = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
  
  const newLastDoc = querySnapshot.docs.length > 0 
    ? querySnapshot.docs[querySnapshot.docs.length - 1] 
    : null;
    
  return { 
    customers, 
    lastDoc: newLastDoc 
  };
}

// Get customer by ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Customer;
  } else {
    return null;
  }
}

// Update customer
export async function updateCustomer(id: string, customerData: CustomerFormData): Promise<Customer> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const customerDoc = await getDoc(docRef);
  
  if (!customerDoc.exists()) {
    throw new Error('Customer not found');
  }
  
  const existingData = customerDoc.data() as Omit<Customer, 'id'>;
  let photoURL = existingData.photoURL;
  
  // Handle photo upload/update/removal
  if (customerData.photo) {
    // Delete existing photo if there is one
    if (photoURL) {
      await deleteCustomerPhoto(photoURL);
    }
    photoURL = await uploadCustomerPhoto(customerData.photo);
  } else if (customerData.photo === null) { // Explicitly handle photo removal
    // Delete existing photo if there is one
    if (photoURL) {
      await deleteCustomerPhoto(photoURL);
    }
    photoURL = null;
  }
  
  const updatedCustomer = {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    photoURL,
    updatedAt: Date.now()
  };
  
  await updateDoc(docRef, updatedCustomer);
  
  return { 
    id, 
    ...existingData, 
    ...updatedCustomer 
  } as Customer;
}

// Delete customer
export async function deleteCustomer(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const customerDoc = await getDoc(docRef);
  
  if (customerDoc.exists()) {
    const customerData = customerDoc.data() as Customer;
    
    // Delete the customer photo if it exists
    if (customerData.photoURL) {
      await deleteCustomerPhoto(customerData.photoURL);
    }
    
    await deleteDoc(docRef);
  }
}

// Search customers
export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  // Firestore doesn't support full-text search natively
  // This is a simple implementation that searches by name
  const q = query(
    customersCollection,
    orderBy('name'),
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
}

// Get customer statistics
export async function getCustomerStatistics() {
  const querySnapshot = await getDocs(customersCollection);
  const customers = querySnapshot.docs.map(doc => doc.data() as Customer);
  
  // Get total number of customers
  const totalCustomers = customers.length;
  
  // Get customers created in the last 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const newCustomers = customers.filter(c => c.createdAt >= thirtyDaysAgo).length;
  
  // Get customers by country (for chart data)
  const countryCounts: Record<string, number> = {};
  customers.forEach(customer => {
    const country = customer.address.country;
    if (countryCounts[country]) {
      countryCounts[country]++;
    } else {
      countryCounts[country] = 1;
    }
  });
  
  const countryData = Object.entries(countryCounts).map(([name, value]) => ({ name, value }));
  
  return {
    totalCustomers,
    newCustomers,
    countryData
  };
}