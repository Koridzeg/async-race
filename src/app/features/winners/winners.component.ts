import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ar-winners',
  standalone: true,
  template: `<p style="color: #8b949e;">Winners view coming next.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersComponent {}