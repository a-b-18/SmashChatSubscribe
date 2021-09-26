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

    const reader = new FileReader();

    // FileReader has an onload event that you handle when it has loaded data
    reader.onload = (e: any) => {
      const data = e.target.result as any;
      console.log(data);

      this.model.filename = "a pdf filen";
      this.model.filedata = data;
      this.model.uploadedby = "alex";

      this.documentService.upload(this.model).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })

    };

    // this will kick off the onload handler above
    reader.readAsDataURL(this.files[0]);
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
