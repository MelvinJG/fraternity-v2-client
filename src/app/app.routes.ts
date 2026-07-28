import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/reports/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
        canActivate: [loginGuard]
    },
    {
        path: 'user',
        children: [
            {
                path: 'list',
                loadComponent: () => import('./components/user/list-users/list-users.component').then(m => m.ListUsersComponent),
                canActivate: [authGuard]
            },
            {
                path: 'new',
                loadComponent: () => import('./components/user/new-user-update/new-user.component').then(m => m.NewUserComponent),
                canActivate: [authGuard],
                data: { mode: 'new' }
            },
            {
                path: 'update',
                loadComponent: () => import('./components/user/new-user-update/new-user.component').then(m => m.NewUserComponent),
                canActivate: [authGuard],
                data: { mode: 'update' }
            }
        ]
    },
    {
        path: 'management',
        children: [
            {
                path: 'turns',
                loadComponent: () => import('./components/management/add-turn/add-turn.component').then(m => m.AddTurnComponent),
                canActivate: [authGuard]
            },
            {
                path: 'receipts',
                loadComponent: () => import('./components/management/receipts/receipts.component').then(m => m.ReceiptsComponent),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'reports',
        loadComponent: () => import('./components/reports/excel-report-turns/excel-report-turns.component').then(m => m.ExcelReportTurnsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'pdf-viewer',
        loadComponent: () => import('./components/pdf-viewer/pdf-viewer.component').then(m => m.PdfViewerComponent),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'home' } // Wildcard SIEMPRE al final
];
