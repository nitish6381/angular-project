import { Routes } from '@angular/router';
import { DepartmentSearchComponent } from './components/department-search/department-search.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: DepartmentSearchComponent },
];
