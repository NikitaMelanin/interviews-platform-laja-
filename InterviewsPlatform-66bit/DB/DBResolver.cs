using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace InterviewsPlatform_66bit.DB;

public class DBResolver : IDBResolver
{
    private readonly MongoClient mongoClient;

    public DBResolver(string mongoConnectionString)
    {
        mongoClient = new MongoClient(mongoConnectionString);
    }

    public IGridFSBucket GetGridFsBucket(string dbName)
    {
        return new GridFSBucket(GetDatabase(dbName));
    }

    public IMongoCollection<T> GetMongoCollection<T>(string dbName, string collectionName)
    {
        return GetDatabase(dbName).GetCollection<T>(collectionName);
    }
    
    private IMongoDatabase GetDatabase(string dbName)
    {
        return mongoClient.GetDatabase(dbName);
    }
}