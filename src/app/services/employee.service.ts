import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/v1/employee-management-system';

  constructor(private http: HttpClient) {}

  getListOfEmployees(): Observable<{ status: boolean; message: string; data: any[] }> {
    return this.http.get<{ status: boolean; message: string; data: any[] }>(`${this.baseUrl}/employee`);
  }

  getEmployeesByDepartment(departmentId: string): Observable<{ status: boolean; message: string; data: any[] }> {
    return this.http.get<{ status: boolean; message: string; data: any[] }>(`${this.baseUrl}/departments/${departmentId}/employees`);
  }

  getEmployeeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/employee/${id}`);
  }

  updateEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employee/${employee.id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employee/${id}`);
  }

  getListOfDepartment(): Observable<{ status: boolean; message: string; data: any[] }> {
    return this.http.get<{ status: boolean; message: string; data: any[] }>(`${this.baseUrl}/departments`);
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employee`, employee);
  }

  addDepartment(department: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/departments`, department);
  }
}
