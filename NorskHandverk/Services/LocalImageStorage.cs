namespace NorskHandverk.Services
{
    // Stores product images in wwwroot/images/products
    public class LocalImageStorage : IImageStorage
    {
        private readonly string _folder;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocalImageStorage(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

            var webRoot = environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
            _folder = Path.Combine(webRoot, "images", "products");
            Directory.CreateDirectory(_folder);
        }

        public async Task<string> SaveProductImageAsync(IFormFile file)
        {
            // Never use the uploaded file name: a random name prevents overwrites and path tricks
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid():N}{extension}";

            await using var stream = File.Create(Path.Combine(_folder, fileName));
            await file.CopyToAsync(stream);

            return fileName;
        }

        public Task DeleteProductImageAsync(string fileName)
        {
            // GetFileName strips any folder part, so only files in this folder can be deleted
            var path = Path.Combine(_folder, Path.GetFileName(fileName));
            if (File.Exists(path))
            {
                File.Delete(path);
            }
            return Task.CompletedTask;
        }

        public string? GetProductImageUrl(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            // Build the URL from the current request, e.g. https://localhost:7140/images/products/abc.jpg
            var request = _httpContextAccessor.HttpContext?.Request;
            if (request == null)
            {
                return null;
            }

            return $"{request.Scheme}://{request.Host}/images/products/{fileName}";
        }
    }
}