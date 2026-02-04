//TransactionMethod.cs
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.Models.TransactionModels
{
    public class TransactionMethod
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Method {  get; set; } //card,vipps,Klarna,kontant

    }
}
