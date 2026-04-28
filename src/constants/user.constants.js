export const USER_REDUX = {
  FETCH_ADMINS: 'user/fetchAdmins',
  FETCH_SUPERUSERS: 'user/fetchSuperUsers',
  ADD_ADMIN: 'user/addAdmin',
  DELETE_ADMIN: 'user/deleteAdmin',

  FETCH_SERVICES: 'services/fetchServices',
  GET_BUSINESS_USERS: '/users/business-users', 
  ADD_USER: 'user/addUser',
  UPDATE_USER_SERVICES: 'user/updateUserServices',
  DELETE_USER: 'user/deleteUser',
};

export const USER_ENDPOINTS = {
  GET_ALL: '/users/get',
  ADD_ADMIN: '/users/add',
  DELETE_ADMIN: (id) => `/users/delete/${id}`,
  RESTORE_ADMIN: (id) => `/users/admin/${id}/restore`,

  GET_BUSINESS_SERVICES: '/users/services',
  GET_BUSINESS_USERS: '/users/business-users',
  GET_USERS_BY_SUPERUSER: (id) => `/users/by-superuser/${id}`,

  ADD_USER: '/users/addUser',
  UPDATE_USER_SERVICES: (id) => `/users/${id}/services`,
  DELETE_USER: (id) => `/users/deleteUser/${id}`,
  RESTORE_USER: (id) => `/users/${id}/restore`,
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin', 
  USER: 'User',
  SUPER_USER: 'SuperUser',
};