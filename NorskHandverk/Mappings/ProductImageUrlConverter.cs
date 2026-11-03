using AutoMapper;
using NorskHandverk.Services;

namespace NorskHandverk.Mappings
{
    // Turns a stored image file name into a URL the browser can load (local disk or signed B2 link)
    public class ProductImageUrlConverter : IValueConverter<string?, string?>
    {
        private readonly IImageStorage _imageStorage;

        public ProductImageUrlConverter(IImageStorage imageStorage)
        {
            _imageStorage = imageStorage;
        }

        public string? Convert(string? sourceMember, ResolutionContext context)
        {
            return _imageStorage.GetProductImageUrl(sourceMember);
        }
    }
}