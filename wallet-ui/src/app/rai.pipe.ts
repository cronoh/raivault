import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rai'
})
export class RaiPipe implements PipeTransform {
  precision = 4;

  transform(value: any, args?: any): any {
    const opts = args.split(',');
    const denomination = opts[0] || 'mrai';
    const hideText = opts[1] || false;

    switch (denomination.toLowerCase()) {
      default:
      case 'mrai': return `${(value / 1000000000000000000000000000000).toFixed(this.precision)}${!hideText ? ' mRai': ''}`;
      case 'krai': return `${(value / 1000000000000000000000000000).toFixed(this.precision)}${!hideText ? ' kRai': ''}`;
      case 'rai': return `${(value / 1000000000000000000000000).toFixed(this.precision)}${!hideText ? ' Rai': ''}`;
      case 'raw': return `${value}${!hideText ? ' raw': ''}`;
      case 'dynamic':
        const rai = (value / 1000000000000000000000000);
        if (rai >= 1000000) {
          return `${(value / 1000000000000000000000000000000).toFixed(this.precision)}${!hideText ? ' mRai': ''}`;
        } else if (rai >= 1000) {
          return `${(value / 1000000000000000000000000000).toFixed(this.precision)}${!hideText ? ' kRai': ''}`;
        } else if (rai >= 0.00001) {
          return `${(value / 1000000000000000000000000).toFixed(this.precision)}${!hideText ? ' Rai': ''}`;
        } else if (rai === 0) {
          return `${value}${!hideText ? ' mRai': ''}`;
        } else {
          return `${value}${!hideText ? ' raw': ''}`;
        }
    }
  }

}
