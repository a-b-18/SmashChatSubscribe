using System;
using System.IO;
using System.Text;
using System.Linq;
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
                FileData = Convert.FromBase64String(uploadDto.FileData),
                FileHeader = uploadDto.FileHeader,
                UploadedBy = uploadDto.UploadedBy.ToLower(),
            };

            // Sync dbContext
            _context.Blob.Add(upload);
            await _context.SaveChangesAsync();

            // Return doc
            return doc;
        }

        [HttpGet("list{user}")]
        public async Task<ActionResult> List(string user)
        {
            // Return results from dbContext where UploadedBy is equal to user
            var readDb = await _context.Blob
                .Where(x => x.UploadedBy == user)
                .ToListAsync();
            
            // Store results for FileName and UploadedBy in DocDto response
            var response = readDb.Select(
                file => new DocDto
                {
                    FileName = file.FileName,
                    UploadedBy = file.UploadedBy
                });

            // Return response
            return Ok(response);
        }


        [HttpPost("read")]
        public async Task<ActionResult<UploadDto>> Read(DocDto doc)
        {
            // Check if DocDto exists in dbContext
            if (!await DocExists(doc)) return BadRequest("File does not exist.");

            // Read AppBlob from dbContext
            var readDb = await _context.Blob
                .FirstOrDefaultAsync(x => x.FileName == doc.FileName);
            
            // Use below to download file
            // string fileLocation = "C:\\Users\\alexb\\Documents\\";
            // string fileName = readDb.FileName;
            // fileLocation = fileLocation + fileName;
            // using (FileStream stream = System.IO.File.Create(fileLocation))
            // {
            //     stream.Write(readDb.FileData, 0, readDb.FileData.Length);
            // }

            var readJson = new UploadDto
            {
                FileName = readDb.FileName,
                FileData = Convert.ToBase64String(readDb.FileData),
                FileHeader = readDb.FileHeader,
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