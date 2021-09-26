using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UploadDto
    {
        [Required]
        public string FileName { get; set; } 
        [Required]
        public string FileData { get; set; }
        [Required]
        public string FileHeader { get; set; }
        [Required]
        public string UploadedBy { get; set; }
    }
}