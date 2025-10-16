import { useState, useEffect } from 'react';
import { SavedAddress } from '@/components/SavedAddresses';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  apartment: string;
  entrance: string;
  floor: string;
  intercom: string;
  comment: string;
  deliveryType: string;
  paymentType: string;
}

export const useCheckoutData = (open: boolean, user?: any) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
    deliveryType: 'delivery',
    paymentType: 'card'
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (open) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || prev.name,
          phone: userData.phone || prev.phone,
          email: userData.email || prev.email
        }));
      }

      const storedAddresses = localStorage.getItem('savedAddresses');
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses);
        setSavedAddresses(addresses);
        
        const defaultAddress = addresses.find((a: SavedAddress) => a.isDefault);
        if (defaultAddress) {
          setFormData(prev => ({
            ...prev,
            city: defaultAddress.city,
            address: defaultAddress.address,
            apartment: defaultAddress.apartment || '',
            entrance: defaultAddress.entrance || '',
            floor: defaultAddress.floor || '',
            intercom: defaultAddress.intercom || ''
          }));
          setHasSavedAddress(true);
        }
      }
      
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.name || prev.name,
          phone: user.phone || prev.phone,
          email: user.email || prev.email
        }));
      }
    }
  }, [user, open]);

  const handleAddAddress = (address: SavedAddress) => {
    const updatedAddresses = [...savedAddresses, address];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSelectAddress = (address: SavedAddress) => {
    setFormData({
      ...formData,
      city: address.city,
      address: address.address,
      apartment: address.apartment || '',
      entrance: address.entrance || '',
      floor: address.floor || '',
      intercom: address.intercom || ''
    });
    setHasSavedAddress(true);
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const isStep1Valid = () => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
      formData.name.trim().length >= 2 &&
      phoneDigits.length === 11 &&
      emailRegex.test(formData.email)
    );
  };

  const isStep2Valid = () => {
    if (formData.deliveryType === 'delivery') {
      return formData.city.trim().length > 0 && formData.address.trim().length > 0;
    }
    return true;
  };

  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = 5;

    if (formData.name.trim().length >= 2) filledFields++;
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length === 11) filledFields++;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(formData.email)) filledFields++;

    if (formData.deliveryType === 'delivery') {
      if (formData.city.trim().length > 0) filledFields++;
      if (formData.address.trim().length > 0) filledFields++;
    } else {
      filledFields += 2;
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  return {
    formData,
    setFormData,
    saveAddress,
    setSaveAddress,
    hasSavedAddress,
    setHasSavedAddress,
    savedAddresses,
    handleAddAddress,
    handleSelectAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    isStep1Valid,
    isStep2Valid,
    calculateProgress
  };
};
