//TransactionStatus.cs
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.Models.TransactionModels
{
    public class TransactionStatus
    {
        [Key]
        public int Id { get; set; }
        public string Status { get; set; } //pending,success,failed
    }
}
