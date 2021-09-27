import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { DocumentService } from '../_services/document.service';

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
      console.log(response);
      this.imageSrc = response.fileHeader + response.fileData;
      this.fileHeader = response.fileHeader;
      this.checkHeader();
    }, error => {
      console.log(error);
    })
  }

  checkHeader() {
    if (this.fileHeader == "data:image/jpeg;base64,"){
      this.imageExists = true;
    }
  }

}
