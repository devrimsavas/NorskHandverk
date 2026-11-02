namespace NorskHandverk.Tests.Integration;

// All API tests share one factory (one test database) and run one after another
[CollectionDefinition("Api")]
public class ApiCollection : ICollectionFixture<NorskHandverkApiFactory>
{
}