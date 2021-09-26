import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  //pdfSrc = "../../assets/test.pdf";

  $http.post('/postUrlHere',{myParams}, {responseType:'arraybuffer'})
    .success(function (response) {
        var file = new Blob([response], {type: 'application/pdf'});
        var fileURL = URL.createObjectURL(file);
  });

  constructor() { }

  ngOnInit(): void {
  }


}
