//TransactionProvider.cs
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.Models.TransactionModels
{
    public class TransactionProvider
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
