using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DocumentController : BaseApiController
    {
        private readonly DataContext _context;

        public DocumentController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<DocDto>> Upload(UploadDto uploadDto)
        {
            // Create DocDto using UploadDto
            var doc = new DocDto
            {
                FileName = uploadDto.FileName,
                UploadedBy = uploadDto.UploadedBy
            };

            // Check if DocDto exists in dbContext
            if (await DocExists(doc)) return BadRequest("File has already been uploaded.");

            // Create AppBlob to load into dbContext
            var upload = new AppBlob
            {
                FileName = uploadDto.FileName,
                FileData = Encoding.ASCII.GetBytes(uploadDto.FileData),
                UploadedBy = uploadDto.UploadedBy.ToLower(),
            };

            // Sync dbContext
            _context.Blob.Add(upload);
            await _context.SaveChangesAsync();

            // Return doc
            return doc;
        }

        [HttpPost("read")]
        public async Task<ActionResult<UploadDto>> Read(DocDto doc)
        {
            // Check if DocDto exists in dbContext
            if (!await DocExists(doc)) return BadRequest("File does not exist.");

            // Read AppBlob from dbContext
            var readDb = await _context.Blob
                .SingleOrDefaultAsync(x => x.FileName == doc.FileName);

            string pdflocation = "C:\\Users\\alexb\\OneDrive\\Desktop\\";
            string fileName = readDb.FileName + ".pdf";

            // parse byte into ASCII and remove blob format header
            var base64String = Encoding.ASCII.GetString(readDb.FileData).Remove(0,28);

            int mod4 = base64String.Length % 4;

            // mod4 will be greater than 0 if the base 64 string is corrupted
            if (mod4 > 0)
            {
                base64String += new string('=', 4 - mod4);
            }
            
            pdflocation = pdflocation + fileName;
            byte[] data = Convert.FromBase64String(base64String);

            using (FileStream stream = System.IO.File.Create(pdflocation))
            {
                stream.Write(data, 0, data.Length);
            }

            var readJson = new UploadDto
            {
                FileName = readDb.FileName,
                FileData = Encoding.ASCII.GetString(readDb.FileData),
                UploadedBy = readDb.UploadedBy
            };

            // Return doc
            return readJson;
        }

        private async Task<bool> DocExists(DocDto uploadDto)
        {
            bool FileExists = await _context.Blob.AnyAsync(ECKeyXmlFormat => ECKeyXmlFormat.FileName == uploadDto.FileName);
            bool UserExists = await _context.Blob.AnyAsync(ECKeyXmlFormat => ECKeyXmlFormat.UploadedBy == uploadDto.UploadedBy);

            return FileExists && UserExists;
        }

    }
}