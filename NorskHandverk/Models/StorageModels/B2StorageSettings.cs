namespace NorskHandverk.Models.StorageModels
{
    // Bound to the "B2Storage" section. If the section is missing, images are stored on local disk.
    public class B2StorageSettings
    {
        // S3-compatible endpoint, e.g. https://s3.eu-central-003.backblazeb2.com
        public string ServiceUrl { get; set; } = string.Empty;

        public string BucketName { get; set; } = string.Empty;

        // Application key ID and secret from Backblaze (never commit these)
        public string KeyId { get; set; } = string.Empty;

        public string ApplicationKey { get; set; } = string.Empty;

        // How long a signed image link stays valid
        public int UrlExpiryMinutes { get; set; } = 60;
    }
}