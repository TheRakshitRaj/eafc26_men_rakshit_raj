class ApiResponse {
  constructor(statusCode, data, message = 'Success', pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }

  send(res) {
    const responsePayload = {
      success: this.success,
      message: this.message,
    };

    if (this.success) {
      responsePayload.data = this.data;
      if (this.pagination) {
        responsePayload.pagination = this.pagination;
      }
    } else {
      responsePayload.error = this.data || {};
    }

    return res.status(this.statusCode).json(responsePayload);
  }

  static success(res, data, message = 'Success', statusCode = 200, pagination = null) {
    return new ApiResponse(statusCode, data, message, pagination).send(res);
  }

  static error(res, error = {}, message = 'An error occurred', statusCode = 500) {
    return new ApiResponse(statusCode, error, message).send(res);
  }
}

export default ApiResponse;
