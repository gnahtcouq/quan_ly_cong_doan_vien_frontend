export const ALL_PERMISSIONS = {
  DEPARTMENTS: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/departments',
      module: 'DEPARTMENTS'
    },
    CREATE: {
      method: 'POST',
      apiPath: '/api/v1/departments',
      module: 'DEPARTMENTS'
    },
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/departments/:id',
      module: 'DEPARTMENTS'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/departments/:id',
      module: 'DEPARTMENTS'
    },
    GET_NUMBER_OF_DEPARTMENTS: {
      method: 'POST',
      apiPath: '/api/v1/departments/count',
      module: 'DEPARTMENTS'
    }
  },
  POSTS: {
    GET_PAGINATE: {method: 'GET', apiPath: '/api/v1/posts', module: 'POSTS'},
    CREATE: {method: 'POST', apiPath: '/api/v1/posts', module: 'POSTS'},
    UPDATE: {method: 'PATCH', apiPath: '/api/v1/posts/:id', module: 'POSTS'},
    DELETE: {method: 'DELETE', apiPath: '/api/v1/posts/:id', module: 'POSTS'},
    GET_NUMBER_OF_POSTS: {
      method: 'POST',
      apiPath: '/api/v1/posts/count',
      module: 'POSTS'
    }
  },
  PERMISSIONS: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/permissions',
      module: 'PERMISSIONS'
    },
    CREATE: {
      method: 'POST',
      apiPath: '/api/v1/permissions',
      module: 'PERMISSIONS'
    },
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/permissions/:id',
      module: 'PERMISSIONS'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/permissions/:id',
      module: 'PERMISSIONS'
    }
  },
  DOCUMENTS: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/documents',
      module: 'DOCUMENTS'
    },
    CREATE: {method: 'POST', apiPath: '/api/v1/documents', module: 'DOCUMENTS'},
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/documents/:id',
      module: 'DOCUMENTS'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/documents/:id',
      module: 'DOCUMENTS'
    },
    GET_NUMBER_OF_DOCUMENTS: {
      method: 'POST',
      apiPath: '/api/v1/documents/count',
      module: 'DOCUMENTS'
    }
  },
  ROLES: {
    GET_PAGINATE: {method: 'GET', apiPath: '/api/v1/roles', module: 'ROLES'},
    CREATE: {method: 'POST', apiPath: '/api/v1/roles', module: 'ROLES'},
    UPDATE: {method: 'PATCH', apiPath: '/api/v1/roles/:id', module: 'ROLES'},
    DELETE: {method: 'DELETE', apiPath: '/api/v1/roles/:id', module: 'ROLES'}
  },
  USERS: {
    GET_PAGINATE: {method: 'GET', apiPath: '/api/v1/users', module: 'USERS'},
    CREATE: {method: 'POST', apiPath: '/api/v1/users', module: 'USERS'},
    UPDATE: {method: 'PATCH', apiPath: '/api/v1/users/:id', module: 'USERS'},
    DELETE: {method: 'DELETE', apiPath: '/api/v1/users/:id', module: 'USERS'},
    GET_NUMBER_OF_USERS: {
      method: 'POST',
      apiPath: '/api/v1/users/count',
      module: 'USERS'
    }
  }
}

export const ALL_MODULES = {
  AUTH: 'AUTH',
  DEPARTMENTS: 'DEPARTMENTS',
  FILES: 'FILES',
  POSTS: 'POSTS',
  PERMISSIONS: 'PERMISSIONS',
  DOCUMENTS: 'DOCUMENTS',
  ROLES: 'ROLES',
  USERS: 'USERS',
  SUBSCRIBERS: 'SUBSCRIBERS'
}
