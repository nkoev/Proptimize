import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseModule } from './shared/modules/firebase.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './modules/core/core.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { OrgchartComponent } from './modules/employees/components/orgchart/orgchart.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, OrgchartComponent],
  imports: [
    AppRoutingModule,
    FirebaseModule,
    SharedModule,
    CoreModule,
    GoogleChartsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
