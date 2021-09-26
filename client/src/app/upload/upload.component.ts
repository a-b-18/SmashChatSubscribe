import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../_services/document.service';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  model: any = {};

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
  }

  upload() {

    // iterate through loaded files
    for (let file in this.files){
      const reader = new FileReader();

      // FileReader has an onload event that you handle when it has loaded data
      reader.onload = (e: any) => {

        // store contents of blob
        const data = e.target.result as any;

        // regex split blob into header/data
        var headerString = /(.+),/.exec(data)[0];
        var dataString = /,(.+)/.exec(data)[1];

        // construct model to send to API
        this.model.filename = this.files[file]["name"];
        this.model.filedata = dataString;
        this.model.fileheader = headerString;
        this.model.uploadedby = "alex";

        // send model via documentService
        this.documentService.upload(this.model).subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        })

      };

      // kick off the onload handler above
        reader.readAsDataURL(this.files[file]);
    };
  }

  files: File[] = [];

  onSelect(event) {
    console.log(this.files);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
