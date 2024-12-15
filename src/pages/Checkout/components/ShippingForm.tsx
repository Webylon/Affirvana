import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { ShippingDetails } from '../../../types';

interface ShippingFormProps {
  onSubmit: (details: ShippingDetails) => void;
  initialData?: ShippingDetails | null;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingDetails, boolean>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateField = (name: keyof ShippingDetails, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : `${name === 'firstName' ? 'First' : 'Last'} name is required`;
      case 'address':
        return value.trim() ? '' : 'Address is required';
      case 'city':
        return value.trim() ? '' : 'City is required';
      case 'state':
        return value.trim() ? '' : 'State is required';
      case 'zipCode':
        return /^\d{5}(-\d{4})?$/.test(value) ? '' : 'Invalid ZIP code format (e.g., 12345 or 12345-6789)';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof ShippingDetails]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name as keyof ShippingDetails, value)
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof ShippingDetails, value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof ShippingDetails>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const inputClasses = (fieldName: keyof ShippingDetails) =>
    `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
      errors[fieldName] && touched[fieldName] ? 'border-red-300' : ''
    }`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="text-purple-600" size={24} />
        <h2 className="text-xl font-semibold">Shipping Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('firstName')}
            />
            {errors.firstName && touched.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('lastName')}
            />
            {errors.lastName && touched.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('address')}
          />
          {errors.address && touched.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('city')}
            />
            {errors.city && touched.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('state')}
            />
            {errors.state && touched.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('zipCode')}
            />
            {errors.zipCode && touched.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Truck className="mr-2 h-5 w-5" />
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;