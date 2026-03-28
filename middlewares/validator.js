export const validateBulkPayload = (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payload format',
      errors: [{ message: 'Payload must be an array of objects' }]
    });
  }
  
  if (req.body.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Empty payload provided',
      errors: [{ message: 'Array must contain at least one item' }]
    });
  }

  if (req.body.length > 5000) {
    return res.status(413).json({
      success: false,
      message: 'Payload too large',
      errors: [{ message: 'Maximum 5000 records allowed per request' }]
    });
  }

  next();
};
