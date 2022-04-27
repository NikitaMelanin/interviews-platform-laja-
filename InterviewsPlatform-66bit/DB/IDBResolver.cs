using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace InterviewsPlatform_66bit.DB;

public interface IDBResolver
{
    public IGridFSBucket GetGridFsBucket(string dbName);
    public IMongoCollection<T> GetMongoCollection<T>(string dbName, string collectionName);
}