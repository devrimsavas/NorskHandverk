using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using NorskHandverk.Models.StorageModels;

namespace NorskHandverk.Services
{
    // Stores product images in a private Backblaze B2 bucket through its S3-compatible API
    public class B2ImageStorage : IImageStorage, IDisposable
    {
        private const string Folder = "products";

        private readonly AmazonS3Client _client;
        private readonly B2StorageSettings _settings;

        public B2ImageStorage(IOptions<B2StorageSettings> options)
        {
            _settings = options.Value;

            var config = new AmazonS3Config
            {
                ServiceURL = _settings.ServiceUrl,
                // The region is part of the endpoint: s3.eu-central-003.backblazeb2.com -> eu-central-003
                AuthenticationRegion = new Uri(_settings.ServiceUrl).Host.Split('.')[1],
                // Keeps the host fixed (endpoint/bucket/key) instead of bucket.endpoint/key
                ForcePathStyle = true,
                // B2 does not support the newer default checksum headers of the AWS SDK
                RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
                ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED
            };

            _client = new AmazonS3Client(_settings.KeyId, _settings.ApplicationKey, config);
        }

        public async Task<string> SaveProductImageAsync(IFormFile file)
        {
            // Same rule as local storage: never trust the uploaded file name
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid():N}{extension}";

            await using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = $"{Folder}/{fileName}",
                InputStream = stream,
                ContentType = file.ContentType,
                UseChunkEncoding = false
            };

            await _client.PutObjectAsync(request);

            return fileName;
        }

        public async Task DeleteProductImageAsync(string fileName)
        {
            await _client.DeleteObjectAsync(_settings.BucketName, $"{Folder}/{Path.GetFileName(fileName)}");
        }

        public string? GetProductImageUrl(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            // The bucket is private, so the browser gets a signed link that expires
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _settings.BucketName,
                Key = $"{Folder}/{fileName}",
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(_settings.UrlExpiryMinutes)
            };

            return _client.GetPreSignedURL(request);
        }

        public void Dispose()
        {
            _client.Dispose();
        }
    }
}