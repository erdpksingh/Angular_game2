import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamesOverviewComponent } from './games-overview/games-overview.component';
import { EntrypointComponent } from './entrypoint/entrypoint.component';
import { GameLanguageComponent, CanDeactivateGameLanguage } from './game-language/game-language.component';
import { AdminComponent } from './admin/admin.component';
import { GamesAdminComponent } from './games-admin/games-admin.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", component: EntrypointComponent, canActivate: [AuthGuard] },
  { path: "games-overview", component: GamesOverviewComponent, canActivate: [AuthGuard] },
  { path: "game-language/:id", component: GameLanguageComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGameLanguage] },
  { path: "admin", component: AdminComponent, canActivate: [AdminAuthGuard] },
  { path: "games-admin", component: GamesAdminComponent, canActivate: [AdminAuthGuard] },
  { path: "users-admin", component: UsersAdminComponent, canActivate: [AdminAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
