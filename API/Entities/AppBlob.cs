namespace API.Entities
{
    public class AppBlob
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public byte[] FileData { get; set; }

    }
}