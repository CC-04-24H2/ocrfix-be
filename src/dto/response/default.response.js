class Response {
  static defaultOK(message, data) {
    const res = {
      status: true,
      code: 200,
      message,
      data,
    };
    return res;
  }

  static defaultCreated(message, data) {
    const res = {
      status: true,
      code: 201,
      message,
      data,
    };
    return res;
  }

  static defaultBadRequest(error) {
    const res = {
      status: false,
      code: 400,
      message: 'Bad request',
      error,
    };
    return res;
  }

  static defaultUnauthorized(error) {
    const res = {
      status: false,
      code: 401,
      message: 'Unauthorized',
      error,
    };
    return res;
  }

  static defaultForbidden(error) {
    const res = {
      status: false,
      code: 403,
      message: 'Forbidden',
      error,
    };
    return res;
  }

  static defaultNotFound(error) {
    const res = {
      status: false,
      code: 404,
      message: 'Not found',
      error,
    };
    return res;
  }

  static defaultInternalError(error) {
    const res = {
      status: false,
      code: 500,
      message: 'Internal error',
      error,
    };
    return res;
  }
}

module.exports = Response;
