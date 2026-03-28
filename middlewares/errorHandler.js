export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];
  let data = null;

  // Handle express.json() limit errors or JSON parsing errors
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Payload Too Large. Maximum allowed size exceeded.';
  } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload format';
  }
  // Handle Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    if (err.errors) {
      errors = Object.keys(err.errors).map(p => ({
        path: p,
        message: err.errors[p].message
      }));
    }
  }
  // Individual Duplicate Key Error
  else if (err.code === 11000 && err.name !== 'BulkWriteError' && err.name !== 'MongoBulkWriteError') {
    statusCode = 409;
    message = 'Duplicate field value entered';
    errors = [{ message: `Duplicate key: ${Object.keys(err.keyValue || {}).join(', ')}` }];
  }
  // Handle Mongoose BulkWriteError (Partial Failures or Duplicates in Bulk Context)
  else if (err.name === 'BulkWriteError' || err.name === 'MongoBulkWriteError') {
    statusCode = 207; // Multi-Status
    message = 'Bulk operation partially fulfilled';
    
    let successCount = 0;
    let failedCount = 0;
    let matchedCount = 0;
    let modifiedCount = 0;

    // Context from insertMany
    if (err.insertedDocs) {
      successCount = err.insertedDocs.length;
    }
    
    // Context from bulkWrite
    if (err.result) {
      matchedCount = err.result.matchedCount || err.result.nMatched || 0;
      modifiedCount = err.result.modifiedCount || err.result.nModified || 0;
      if (!err.insertedDocs) {
        successCount = modifiedCount; // Treat modified as success for updates
      }
    }

    if (err.writeErrors) {
      failedCount = err.writeErrors.length;
      errors = err.writeErrors.map(e => ({
        index: e.index,
        code: e.code,
        message: e.errmsg || e.message
      }));
    }

    // If validation errors are embedded inside a bulk failure depending on mongoose versions
    if (err.errors && typeof err.errors === 'object') {
       const paths = Object.keys(err.errors);
       failedCount += paths.length;
       errors.push(...paths.map(p => ({
           path: p,
           message: err.errors[p].message
       })));
    }

    data = {
      successCount,
      failedCount,
      matchedCount,
      modifiedCount
    };
    
    // Override if ALL operations actually failed
    if (successCount === 0 && failedCount > 0) {
       statusCode = 400;
       message = 'Bulk operation completely failed';
    }
  }

  // Ensure consistent success boolean format 
  const isSuccess = statusCode >= 200 && statusCode < 300;

  res.status(statusCode).json({
    success: isSuccess,
    message,
    ...(data && { data }),
    ...(errors.length > 0 && { errors })
  });
};
