using System;

namespace API.Entities
{
    public class AppBlob
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public byte[] FileData { get; set; }
        public string UploadedBy { get; set; }
        public DateTime UploadTime { get; set; } = DateTime.Now;
    }
}