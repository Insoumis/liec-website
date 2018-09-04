
using LIEC_Website.Model;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LIEC_Website.Data
{
    public class MongoDbContext
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
        protected static IMongoCollection<ContentModel> _contentDataCollection;
        protected static IMongoQueryable<ContentModel> _contentDataCollectionQueryable;
        protected static GridFSBucket _videoBucket;
        protected static GridFSBucket _imageBucket;
        const int Default_Cache_Duration = 45;

        public static IHttpContextAccessor HttpContextAccessor { get; set; }

        public static void Configure(string connectionString)
        {
            _client = new MongoClient(connectionString);
            _database = _client.GetDatabase("liec");
            _contentDataCollection = _database.GetCollection<ContentModel>("content");
            _contentDataCollectionQueryable = _contentDataCollection.AsQueryable();
            _videoBucket = new GridFSBucket(_database, new GridFSBucketOptions
            {
                BucketName = "videos",
                ChunkSizeBytes = 1048576, // 1MB
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary
            });
            _imageBucket = new GridFSBucket(_database, new GridFSBucketOptions
            {
                BucketName = "image",
                ChunkSizeBytes = 1048576, // 1MB
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary
            });
        }

        #region ContentModel

        public static async Task<ObjectId> UploadImage(string title, Byte[] bytes)
        {
            var imageId = await _imageBucket.UploadFromBytesAsync(title, bytes);
            return imageId;
        }
        public static async Task<long> Content_CountAll()
        {
            var count = await _contentDataCollection.CountDocumentsAsync(x => true);
            return count;
        }

        public static async Task<ICollection<ContentModel>> Content_GetAll()
        {
            var query = await _contentDataCollection.FindAsync(x => true);
            var contents = await query.ToListAsync();
 
            return contents ?? new List<ContentModel>();
        }

        //public static async Task<ICollection<ContentModel>> Content_GetByCurrentUser()
        //{
        //    var userId = HttpContextAccessor.HttpContext.User.GetUserId();
        //    return await Content_GetUsercontents(userId);
        //}

        public static async Task<ICollection<ContentModel>> Content_GetByUser(string userId)
        {
            var query = await _contentDataCollection.FindAsync(x => x.Creator == userId);
            var contents = await query.ToListAsync();
            return contents.OrderBy(x => x.CreationDate).ThenBy(x => x.ModificationDate).ToList();
        }


        //public static async Task<ICollection<ContentModel>> Content_GetUserSystemcontents(string userId)
        //{
        //    var query = await _contentDataCollection.FindAsync(x => x.UserId == userId && x.IsSystem == true);
        //    var contents = await query.ToListAsync();
        //    return contents.Where(x => x.UserId == userId).OrderBy(x => !x.IsSystem).ThenBy(x => x.Name).ToList();
        //}

        //public static async Task<ICollection<ContentModel>> Content_GetAllCurrentUsercontents()
        //{
        //    var userId = HttpContextAccessor.HttpContext.User.GetUserId();
        //    var query = await _contentDataCollection.FindAsync(x => x.UserId == userId);
        //    var contents = await query.ToListAsync();
        //    return contents.Where(x => x.UserId == userId).OrderBy(x => !x.IsSystem).ThenBy(x => x.Name).ToList();
        //}

        public static async Task<ContentModel> Content_Get(ObjectId id)
        {
            var content = await _contentDataCollectionQueryable.FirstOrDefaultAsync(x => x.Id == id);
            return content;
        }

        public static async Task Content_Create(ContentModel data)
        {
            data.CreationDate = DateTime.Now;
            await _contentDataCollection.InsertOneAsync(data);
        }

        public static async Task Content_BulkCreate(List<ContentModel> datas)
        {
            foreach (var data in datas)
            {
                data.CreationDate = DateTime.Now;
                data.ModificationDate = DateTime.Now;
            }
            await _contentDataCollection.InsertManyAsync(datas);
        }

        public static async Task<DeleteResult> Content_Delete(ObjectId id)
        {
            var results = await _contentDataCollection.DeleteOneAsync(x => x.Id == id);
            return results;
        }

        //public static async Task<DeleteResult> Content_DeleteAllFromCurrentUser()
        //{
        //    var results = await _contentDataCollection.DeleteManyAsync(x => x.UserId == HttpContextAccessor.HttpContext.User.GetUserId());
        //    return results;
        //}

        //public static async Task<DeleteResult> Content_DeleteAllFromUserId(string userId)
        //{
        //    var results = await _contentDataCollection.DeleteManyAsync(x => x.UserId == userId);
        //    return results;
        //}

        public static async Task<ReplaceOneResult> Content_Update(ContentModel data)
        {
            data.ModificationDate = DateTime.Now;
            var result = await _contentDataCollection.ReplaceOneAsync(x => x.Id == data.Id, data);
            return result;
        }

        public static async Task<ContentModel> Content_CreateOrUpdate(ContentModel data)
        {
            var query = await _contentDataCollection.FindAsync(x => x.Id == data.Id);
            var existing = await query.AnyAsync();

            if (existing)
            {
                await Content_Update(data);
            }
            else
            {
                await Content_Create(data);
            }

            return data;
        }
        #endregion
    }
}
