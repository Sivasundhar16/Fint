const ApiRes = (res, statusCode, message, data = {}) => {
  const success = statusCode >= 200 && statusCode < 400;

  return res.status(statusCode).json({
    success,
    message,
    ...data,
  });
};

export default ApiRes;
