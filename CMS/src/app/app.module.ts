import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamesOverviewComponent } from './games-overview/games-overview.component';
import { EntrypointComponent } from './entrypoint/entrypoint.component';
import { GameLanguageComponent, CanDeactivateGameLanguage } from './game-language/game-language.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { GamesAdminComponent } from './games-admin/games-admin.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PapaParseModule } from 'ngx-papaparse';
import { FileSaverModule } from 'ngx-filesaver';
import { NewGameLanguageComponent } from './new-game-language/new-game-language.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AssignGameLanguageComponent } from './assign-game-language/assign-game-language.component';
import { LoginComponent } from './login/login.component';
import { ConfigService } from './config.service';
import { NotificationComponent, NotificationHandler } from './notification/notification.component';
import { NotificationService } from './notification.service';
import { APP_BASE_HREF } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeploymentInfoDialogComponent } from './deployment-info-dialog/deployment-info-dialog.component';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { FooterComponent } from './footer/footer.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/");
}

export function InitializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    GamesOverviewComponent,
    EntrypointComponent,
    GameLanguageComponent,
    HeaderComponent,
    AdminComponent,
    GamesAdminComponent,
    UsersAdminComponent,
    ImportDialogComponent,
    NewGameLanguageComponent,
    ConfirmationDialogComponent,
    AssignGameLanguageComponent,
    LoginComponent,
    NotificationComponent,
    NotificationHandler,
    DeploymentInfoDialogComponent,
    NewGameDialogComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    PapaParseModule,
    FileSaverModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CanDeactivateGameLanguage,
    NotificationService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: InitializeApp,
      deps: [ConfigService, NotificationService], multi: true
    }, {
      provide: APP_BASE_HREF,
      useValue: window["baseUrl"]
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent, DeploymentInfoDialogComponent, NewGameDialogComponent, ImportDialogComponent, NotificationComponent]
})
export class AppModule { }
