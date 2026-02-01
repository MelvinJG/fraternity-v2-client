import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { ListUsersComponent } from './components/user/list-users/list-users.component';
import { NewUserComponent } from './components/user/new-user-update/new-user.component';
import { AddTurnComponent } from './components/management/add-turn/add-turn.component';
import { ReceiptsComponent } from './components/management/receipts/receipts.component';
import { ExcelReportTurnsComponent } from './components/excel-report-turns/excel-report-turns.component';
import { authGuard } from './guards/auth.guard';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'user', 
        children: [
            { path: 'list', component: ListUsersComponent, canActivate: [authGuard] },
            { path: 'new', component: NewUserComponent, canActivate: [authGuard], data: { mode: 'new' } },
            { path: 'update', component: NewUserComponent, canActivate: [authGuard], data: { mode: 'update' } }
        ]
    },
    { path: 'management', 
        children: [
            { path: 'turns', component: AddTurnComponent, canActivate: [authGuard] },
            { path: 'receipts', component: ReceiptsComponent, canActivate: [authGuard] }
        ]
    },
    { path: 'reports', component: ExcelReportTurnsComponent, canActivate: [authGuard] },
    { path: 'pdf-viewer', component: PdfViewerComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home' } // Wildcard SIEMPRE al final
];
