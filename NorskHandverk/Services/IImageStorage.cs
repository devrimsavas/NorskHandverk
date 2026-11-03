namespace NorskHandverk.Services
{
    public interface IImageStorage
    {
        // Saves the image and returns the stored file name
        Task<string> SaveProductImageAsync(IFormFile file);

        Task DeleteProductImageAsync(string fileName);

        // Returns a full URL the browser can load, or null if there is no image
        string? GetProductImageUrl(string? fileName);
    }
}