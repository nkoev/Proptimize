import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './modules/core/guards/auth.guard';
import { AdminGuard } from './modules/core/guards/admin.guard';
import { LoginGuard } from './modules/core/guards/login.guard';
import { LoggedUserResolver } from './modules/core/resolvers/logged-user.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    resolve: { loggedUser: LoggedUserResolver },
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./modules/projects/projects.module').then(
        (m) => m.ProjectsModule
      ),
    canActivate: [AuthGuard],
    resolve: { loggedUser: LoggedUserResolver },
  },
  {
    path: 'skills',
    loadChildren: () =>
      import('./modules/skills/skills.module').then((m) => m.SkillsModule),
    canActivate: [AuthGuard, AdminGuard],
    resolve: { loggedUser: LoggedUserResolver },
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./modules/employees/employees.module').then(
        (m) => m.EmployeesModule
      ),
    canActivate: [AuthGuard],
    resolve: { loggedUser: LoggedUserResolver },
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
