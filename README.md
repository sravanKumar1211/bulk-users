# Bulk Users API

A production-ready minimal Node.js + Express backend built with ES Modules. Features a MongoDB connection via Mongoose with optimized indexing, global error handling, and robust bulk APIs for users.

## Features

- **ES Modules**: Modern JavaScript syntax.
- **Mongoose ORM**: Configured with strict schema validations and compound indexes.
- **Robust Bulk Operations**:
  - `POST /api/users/bulk-create` - Handles inserting arrays up to 5000 records leveraging `insertMany` with `ordered: false` and `lean: true`.
  - `PUT /api/users/bulk-update` - Handles bulk updates avoiding loops using Mongoose's native `bulkWrite`.
- **Global Error Handling**: Safely parses `BulkWriteError`, `ValidationError`, duplicate keys, and large payloads.
- **Security & Limits**: Configured payload caps (`10mb` Express limit) and a dedicated schema payload validator.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file inside the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/minimal-db
   ```
   *(Ensure you have an active MongoDB instance running locally or externally)*

3. **Start the Server**
   ```bash
   node server.js
   ```

## Endpoints

- **Health Check**: `GET /api/health`
- **Bulk Create**: `POST /api/users/bulk-create`
- **Bulk Update**: `PUT /api/users/bulk-update`
