import User from '../models/User.js';

export const bulkCreateUsers = async (req, res, next) => {
  try {
    const users = req.body;
    
    // We expect the array to be validated by the validateBulkPayload middleware prior
    const result = await User.insertMany(users, { ordered: false, lean: true });

    return res.status(201).json({
      success: true,
      message: 'Users bulk creation successful',
      data: {
        successCount: result.length,
        failedCount: 0
      }
    });
  } catch (error) {
    // Escalate to global error handler
    next(error);
  }
};

export const bulkUpdateUsers = async (req, res, next) => {
  try {
    const updates = req.body;

    const operations = updates
      .map((user) => {
        const filter = {};
        if (user.email && user.phone) {
          filter.$or = [{ email: user.email }, { phone: user.phone }];
        } else if (user.email) {
          filter.email = user.email;
        } else if (user.phone) {
          filter.phone = user.phone;
        } else {
          return null; // Skip mapping invalid users natively missing both core identities
        }

        return {
          updateOne: {
            filter,
            update: { $set: user },
            upsert: false,
          },
        };
      })
      .filter((op) => op !== null);

    if (operations.length === 0) {
      const error = new Error('No valid update operations provided (missing email or phone)');
      error.statusCode = 400;
      return next(error);
    }

    const result = await User.bulkWrite(operations, { ordered: false });

    return res.status(200).json({
      success: true,
      message: 'Users bulk update successful',
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        successCount: result.modifiedCount,
        failedCount: operations.length - result.modifiedCount,
      }
    });
  } catch (error) {
    next(error);
  }
};
