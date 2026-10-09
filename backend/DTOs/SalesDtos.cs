using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateMilkSaleDto
{
    [Required(ErrorMessage = "Customer name is required.")]
    public string CustomerName { get; set; } = string.Empty;

    [Range(0.1, 10000, ErrorMessage = "Litres sold must be greater than 0.")]
    public decimal LitresSold { get; set; }

    [Range(1, 1000, ErrorMessage = "Price per litre must be a positive value.")]
    public decimal PricePerLitre { get; set; }

    public DateTime? SaleDate { get; set; }
}

public class CreateMalaSaleDto
{
    [Required(ErrorMessage = "Customer name is required.")]
    public string CustomerName { get; set; } = string.Empty;

    [Range(0.1, 10000, ErrorMessage = "Quantity must be greater than 0.")]
    public decimal QuantityLitres { get; set; }

    [Range(1, 2000, ErrorMessage = "Unit price must be a positive value.")]
    public decimal UnitPrice { get; set; }

    public DateTime? SaleDate { get; set; }
}

public class CreateCowSaleDto
{
    [Required(ErrorMessage = "Cow ID is required.")]
    public Guid CowId { get; set; }

    [Required(ErrorMessage = "Buyer name is required.")]
    public string BuyerName { get; set; } = string.Empty;

    [Range(1000, 5000000, ErrorMessage = "Sale amount must be realistic.")]
    public decimal Amount { get; set; }

    public DateTime? SaleDate { get; set; }
}