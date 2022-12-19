import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss']
})
export class RendererComponent implements OnInit {
  public inputField: FormControl = new FormControl<string>('');
  public latexCode = `You can write text, that expressions like this: $x ^ 2 + 5$ inside them. As you probably know. You also can write expressions in display mode as follows: $$\sum_{i=1}^n(x_i^2 - \overline{x}^2)$$. In first case you will need to use \$expression\$ and in the second one \$\$expression\$\$. To scape the \$ symbol it's mandatory to write as follows: \\$`;

  constructor() { }

  ngOnInit(): void {
  }

  public updateLatex(): void {
    this.latexCode = this.inputField.value;
  }

}
