//Transaction.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NorskHandverk.Models.OrderModels;

namespace NorskHandverk.Models.TransactionModels
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string TransactionNumber { get; set; }

        //amount 
        public decimal Amount { get; set; }

        //currency 
        public string Currency {  get; set; }   




        //Order 
        public Order Order { get; set; }
        public int OrderId { get; set; }

        //Transaction method
        public TransactionMethod TransactionMethod { get; set; }
        public int TransactionMethodId { get; set; }
        //Transaction Provider
        public TransactionProvider TransactionProvider { get; set; }
        public int TransactionProviderId { get; set; }  

        //transaction status 
        public TransactionStatus TransactionStatus { get; set; }
        public int TransactionStatusId { get; set; }

        //Created at 
        public DateTime CreateadAt { get; set; } 

    }
}
