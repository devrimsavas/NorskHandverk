namespace NorskHandverk.Services
{
    public interface IImageStorage
    {
        // Saves the image and returns the stored file name
        Task<string> SaveProductImageAsync(IFormFile file);

        Task DeleteProductImageAsync(string fileName);

    }
}
