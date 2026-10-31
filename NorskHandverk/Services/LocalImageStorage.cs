namespace NorskHandverk.Services
{
    // Stores product images in wwwroot/images/products
    public class LocalImageStorage : IImageStorage
    {
        private readonly string _folder;

        public LocalImageStorage(IWebHostEnvironment environment)
        {
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
    }
}