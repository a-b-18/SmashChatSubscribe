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
  viewModel: any = {};
  imageExists: boolean = false;
  userName = this.accountService.getCurrentUser();

  constructor(private documentService: DocumentService, public accountService: AccountService) { }

  ngOnInit(): void {
    this.view();
  }

  view() {
    // construct model to send to API
    this.model.filename = "20190211_105614.jpg";
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
