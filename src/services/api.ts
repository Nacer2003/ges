import { apiRequest } from '../config/api';

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    
    return response;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiRequest('/api/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getMe: async () => {
    return apiRequest('/api/auth/me/');
  },

  getUsers: async () => {
    return apiRequest('/api/auth/users/');
  },

  createUser: async (userData: FormData) => {
    return apiRequest('/api/auth/users/', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: userData,
    });
  },

  updateUser: async (userId: string, userData: FormData) => {
    return apiRequest(`/api/auth/users/${userId}/`, {
      method: 'PATCH',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: userData,
    });
  },

  deleteUser: async (userId: string) => {
    return apiRequest(`/api/auth/users/${userId}/`, {
      method: 'DELETE',
    });
  },
};

// Stores Service
export const storesService = {
  getStores: async () => {
    return apiRequest('/api/stores/');
  },

  createStore: async (storeData: any) => {
    return apiRequest('/api/stores/', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  },

  updateStore: async (storeId: string, storeData: any) => {
    return apiRequest(`/api/stores/${storeId}/`, {
      method: 'PATCH',
      body: JSON.stringify(storeData),
    });
  },

  deleteStore: async (storeId: string) => {
    return apiRequest(`/api/stores/${storeId}/`, {
      method: 'DELETE',
    });
  },
};

// Products Service
export const productsService = {
  getProducts: async () => {
    return apiRequest('/api/products/');
  },

  createProduct: async (productData: FormData) => {
    return apiRequest('/api/products/', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: productData,
    });
  },

  updateProduct: async (productId: string, productData: FormData) => {
    return apiRequest(`/api/products/${productId}/`, {
      method: 'PATCH',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: productData,
    });
  },

  deleteProduct: async (productId: string) => {
    return apiRequest(`/api/products/${productId}/`, {
      method: 'DELETE',
    });
  },
};

// Stock Service
export const stockService = {
  getStocks: async () => {
    return apiRequest('/api/stock/');
  },

  createStock: async (stockData: any) => {
    return apiRequest('/api/stock/', {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  },

  updateStock: async (stockId: string, stockData: any) => {
    return apiRequest(`/api/stock/${stockId}/`, {
      method: 'PATCH',
      body: JSON.stringify(stockData),
    });
  },

  deleteStock: async (stockId: string) => {
    return apiRequest(`/api/stock/${stockId}/`, {
      method: 'DELETE',
    });
  },

  createMovement: async (movementData: any) => {
    return apiRequest('/api/stock/movements/', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  },

  getMovements: async () => {
    return apiRequest('/api/stock/movements/');
  },
};

// Suppliers Service
export const suppliersService = {
  getSuppliers: async () => {
    return apiRequest('/api/suppliers/');
  },

  createSupplier: async (supplierData: any) => {
    return apiRequest('/api/suppliers/', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  updateSupplier: async (supplierId: string, supplierData: any) => {
    return apiRequest(`/api/suppliers/${supplierId}/`, {
      method: 'PATCH',
      body: JSON.stringify(supplierData),
    });
  },

  deleteSupplier: async (supplierId: string) => {
    return apiRequest(`/api/suppliers/${supplierId}/`, {
      method: 'DELETE',
    });
  },
};

// Attendance Service
export const attendanceService = {
  getAttendance: async () => {
    return apiRequest('/api/attendance/');
  },

  createAttendance: async (attendanceData: any) => {
    return apiRequest('/api/attendance/', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },

  updateAttendance: async (attendanceId: string, attendanceData: any) => {
    return apiRequest(`/api/attendance/${attendanceId}/`, {
      method: 'PATCH',
      body: JSON.stringify(attendanceData),
    });
  },

  deleteAttendance: async (attendanceId: string) => {
    return apiRequest(`/api/attendance/${attendanceId}/`, {
      method: 'DELETE',
    });
  },
};

// Messaging Service
export const messagingService = {
  getMessages: async () => {
    return apiRequest('/api/messaging/');
  },

  createMessage: async (messageData: any) => {
    return apiRequest('/api/messaging/', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  updateMessage: async (messageId: string, messageData: any) => {
    return apiRequest(`/api/messaging/${messageId}/`, {
      method: 'PATCH',
      body: JSON.stringify(messageData),
    });
  },

  deleteMessage: async (messageId: string) => {
    return apiRequest(`/api/messaging/${messageId}/`, {
      method: 'DELETE',
    });
  },
};