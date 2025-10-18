// MongoDB Initialization Script
// This script runs automatically on first MongoDB container startup
// Creates application database user with read/write permissions
//
// Environment variables required:
//   - MONGO_INITDB_DATABASE: Database name to create
//   - MONGODB_APP_USERNAME: Application user username
//   - MONGODB_APP_PASSWORD: Application user password
//
// The script is executed in the context of the admin database,
// but creates the user in the application database specified by MONGO_INITDB_DATABASE

// Switch to the application database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGODB_APP_USERNAME,
  pwd: process.env.MONGODB_APP_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_INITDB_DATABASE
    }
  ]
});

// Log success message for debugging
print('================================================================================');
print('TomeForge MongoDB Initialization Complete');
print('================================================================================');
print('Database: ' + process.env.MONGO_INITDB_DATABASE);
print('Application user: ' + process.env.MONGODB_APP_USERNAME);
print('Permissions: readWrite on ' + process.env.MONGO_INITDB_DATABASE);
print('================================================================================');
