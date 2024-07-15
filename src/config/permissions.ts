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
    },
    ACCESS_TO_ADMIN_PAGE: {
      method: 'ACCESS_TO_ADMIN_PAGE',
      apiPath: '/admin',
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
  },
  UNIONISTS: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/unionists',
      module: 'UNIONISTS'
    },
    CREATE: {method: 'POST', apiPath: '/api/v1/unionists', module: 'UNIONISTS'},
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/unionists/:id',
      module: 'UNIONISTS'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/unionists/:id',
      module: 'UNIONISTS'
    },
    GET_NUMBER_OF_UNIONISTS: {
      method: 'POST',
      apiPath: '/api/v1/unionists/count',
      module: 'UNIONISTS'
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
  USERS: 'USERS',
  UNIONISTS: 'UNIONISTS',
  SUBSCRIBERS: 'SUBSCRIBERS'
}
