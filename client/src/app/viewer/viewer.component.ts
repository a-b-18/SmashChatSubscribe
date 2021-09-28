import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { DocumentService } from '../_services/document.service';
import { base64StringToBlob, createObjectURL } from 'blob-util';
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  model: any = {};
  imageSrc: string = "";
  fileHeader: string = "";
  fileList: string [] = [];
  selectedFile: string = "";
  viewModel: any = {};
  imageExists: boolean = false;
  userName: string = "";
  blobUrl: string = "";

  constructor(private documentService: DocumentService, public accountService: AccountService) { }

  ngOnInit(): void {
    this.userName = this.accountService.getCurrentUser();
    this.view();
    this.list();
  }

  list() {

    // send model via documentService
    this.documentService.list(this.userName).subscribe(response => {
      for (var i in response) {
        this.fileList.push(response[i]["fileName"]);
      }
    }, error => {
      console.log(error);
    })
  }

  view() {
    // construct model to send to API
    this.model.filename = this.selectedFile;
    this.model.uploadedby = this.userName;

    // send model via documentService
    this.documentService.view(this.model).subscribe(response => {

      // use response to construct blob
      const contentType = response.fileHeader.match(/:(.+);/)[1];
      const blob = base64StringToBlob(response.fileData, contentType);

      // assign blob to URL
      this.blobUrl = createObjectURL(blob);
      var newDoc = document.createElement('iframe');
      newDoc.src = this.blobUrl;
      document.body.appendChild(newDoc);
      this.imageExists = true;

    }, error => {
      console.log(error);
    })
  }

}
