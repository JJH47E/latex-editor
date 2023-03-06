import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit, OnChanges {

  @Input()
  public imageData: Uint8Array = new Uint8Array();
  @Input()
  public contentType: string = '';

  public thumbnail: SafeUrl = {} as SafeUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {  }
  
  ngOnChanges(_: SimpleChanges): void {
    const objectURL = URL.createObjectURL(new Blob([this.imageData], { type: this.contentType }));
    const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.thumbnail = img;
    this.changeDetectorRef.detectChanges();
  }
}
