const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://subvivah:matrimony%40123@cluster0.2wmxzb7.mongodb.net/subvivah?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";

const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    ssl: true,
    tls: true,
    minPoolSize: 1,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true
};

async function testConnection() {
    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(uri, options);
    
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        
        // Test the connection by listing databases
        const databasesList = await client.db().admin().listDatabases();
        console.log('Available databases:');
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        
    } catch (error) {
        console.error('Connection error:', error);
        if (error.cause) {
            console.error('Detailed error:', error.cause);
        }
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

testConnection(); 