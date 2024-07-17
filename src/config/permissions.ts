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
  },
  FEES: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/fees',
      module: 'FEES'
    },
    CREATE: {method: 'POST', apiPath: '/api/v1/fees', module: 'FEES'},
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/fees/:id',
      module: 'FEES'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/fees/:id',
      module: 'FEES'
    },
    GET_NUMBER_OF_FEES: {
      method: 'POST',
      apiPath: '/api/v1/fees/count',
      module: 'FEES'
    }
  },
  RECEIPTS: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/receipts',
      module: 'RECEIPTS'
    },
    CREATE: {method: 'POST', apiPath: '/api/v1/receipts', module: 'RECEIPTS'},
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/receipts/:id',
      module: 'RECEIPTS'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/receipts/:id',
      module: 'RECEIPTS'
    },
    GET_NUMBER_OF_RECEIPTS: {
      method: 'POST',
      apiPath: '/api/v1/receipts/count',
      module: 'RECEIPTS'
    }
  },
  INCOMECATEGORIES: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/income-categories',
      module: 'INCOMECATEGORIES'
    },
    CREATE: {
      method: 'POST',
      apiPath: '/api/v1/income-categories',
      module: 'INCOMECATEGORIES'
    },
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/income-categories/:id',
      module: 'INCOMECATEGORIES'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/income-categories/:id',
      module: 'INCOMECATEGORIES'
    },
    GET_NUMBER_OF_INCOMECATEGORIES: {
      method: 'POST',
      apiPath: '/api/v1/income-categories/count',
      module: 'INCOMECATEGORIES'
    }
  },
  EXPENSES: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/expenses',
      module: 'EXPENSES'
    },
    CREATE: {method: 'POST', apiPath: '/api/v1/expenses', module: 'EXPENSES'},
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/expenses/:id',
      module: 'EXPENSES'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/expenses/:id',
      module: 'EXPENSES'
    },
    GET_NUMBER_OF_EXPENSES: {
      method: 'POST',
      apiPath: '/api/v1/expenses/count',
      module: 'EXPENSES'
    }
  },
  EXPENSECATEGORIES: {
    GET_PAGINATE: {
      method: 'GET',
      apiPath: '/api/v1/expense-categories',
      module: 'EXPENSECATEGORIES'
    },
    CREATE: {
      method: 'POST',
      apiPath: '/api/v1/expense-categories',
      module: 'EXPENSECATEGORIES'
    },
    UPDATE: {
      method: 'PATCH',
      apiPath: '/api/v1/expense-categories/:id',
      module: 'EXPENSECATEGORIES'
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/expense-categories/:id',
      module: 'EXPENSECATEGORIES'
    },
    GET_NUMBER_OF_EXPENSECATEGORIES: {
      method: 'POST',
      apiPath: '/api/v1/expense-categories/count',
      module: 'EXPENSECATEGORIES'
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
  SUBSCRIBERS: 'SUBSCRIBERS',
  FEES: 'FEES',
  RECEIPTS: 'RECEIPTS',
  INCOMECATEGORIES: 'INCOMECATEGORIES',
  EXPENSES: 'EXPENSES',
  EXPENSECATEGORIES: 'EXPENSECATEGORIES'
}
