import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Observable } from 'rxjs';
import { Recommendedfees } from '../../interfaces/websocket.interface';
import { feeLevels } from '../../app.constants';
import { tap } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-fees-box',
  templateUrl: './fees-box.component.html',
  styleUrls: ['./fees-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeesBoxComponent implements OnInit {
  isLoadingWebSocket$: Observable<boolean>;
  recommendedFees$: Observable<Recommendedfees>;
  gradient = 'linear-gradient(to right, #2e324e, #2e324e)';
  noPriority = '#2e324e';

  constructor(
    private stateService: StateService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.isLoadingWebSocket$ = this.stateService.isLoadingWebSocket$;
    this.recommendedFees$ = this.stateService.recommendedFees$
      .pipe(
        tap((fees) => {
          let feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.minimumFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const startColor = '#' + (this.themeService.mempoolFeeColors[feeLevelIndex - 1] || this.themeService.mempoolFeeColors[this.themeService.mempoolFeeColors.length - 1]);

          feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.fastestFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const endColor = '#' + (this.themeService.mempoolFeeColors[feeLevelIndex - 1] || this.themeService.mempoolFeeColors[this.themeService.mempoolFeeColors.length - 1]);

          this.gradient = `linear-gradient(to right, ${startColor}, ${endColor})`;
          this.noPriority = startColor;
        }
      )
    );
  }
}
