export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: Address;
  photo?: File | null;
}