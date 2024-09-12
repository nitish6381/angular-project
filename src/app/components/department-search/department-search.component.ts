import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-department-search',
  templateUrl: './department-search.component.html',
  styleUrls: ['./department-search.component.css'],
  standalone: true,
  imports: [
    FormsModule, 
    HttpClientModule, 
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [EmployeeService],
})

export class DepartmentSearchComponent implements OnInit {
  departmentId: string = '';
  departments: any[] = [];
  employees: any[] = [];
  paginatedEmployees = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'email', 'position', 'salary', 'departmentName', 'actions'];
  pageSize: number = 10;
  isViewing: boolean = false;

  newDepartment = { name: '', location: '' };
  newEmployee = { name: '', email: '', position: '', salary: 0, departmentId: '' };
  selectedEmployee = { id:'', name: '', email: '', position: '', salary: 0, departmentId: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('addDepartmentModal') addDepartmentModal!: TemplateRef<any>;
  @ViewChild('addEmployeeModal') addEmployeeModal!: TemplateRef<any>;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: TemplateRef<any>;

  constructor(private router: Router, private employeeService: EmployeeService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadInitialListDepartment();
    this.loadInitialListEmployee();
  }

  loadInitialListEmployee() {
    this.employeeService.getListOfEmployees().subscribe(
      (response: { status: boolean; message: string; data: any[] }) => {
        const { data: employees } = response;
        this.employees = employees;
        this.paginatedEmployees.data = employees;
        this.paginatedEmployees.paginator = this.paginator;
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }

  loadInitialListDepartment() {
    this.employeeService.getListOfDepartment().subscribe(
      (response: { status: boolean; message: string; data: any[] }) => {
        const { data: departments } = response;
        this.departments = departments;
      },
      (error) => {
        console.error('Error loading departments', error);
      }
    );
  }

  loadEmployees(id: string) {
    this.employeeService.getEmployeesByDepartment(id).subscribe(
      (response: { status: boolean; message: string; data: any[] }) => {
        const { data: employees } = response;
        this.employees = employees;
        this.paginatedEmployees.data = employees;
        this.paginatedEmployees.paginator = this.paginator;
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }

  onDepartmentChange() {
    this.loadEmployees(this.departmentId);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedEmployees.data = this.employees.slice(startIndex, endIndex);
  }

  openAddDepartmentModal() {
    const dialogRef = this.dialog.open(this.addDepartmentModal, {
      width: '1000px',
      data: this.newDepartment,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addDepartment(result);
      }
    });
  }

  openViewEmployeeModal(employee: any) {
    const dialogRef = this.dialog.open(this.addEmployeeModal, {
      width: '1000px',
      data: { ...employee, departments: this.departments },
    });
    this.isViewing = true;
    this.selectedEmployee = { ...employee };
    this.dialog.open(this.addEmployeeModal);
  }

  openAddEmployeeModal() {
    const dialogRef = this.dialog.open(this.addEmployeeModal, {
      width: '1000px',
      data: { ...this.newEmployee, departments: this.departments },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEmployee(result);
      }
    });
  }

  addDepartment(department: any) {
    console.log('Department added:', department);
    this.employeeService.addDepartment(department).subscribe(
      (response) => {
        console.log('Department added:', response);
        this.loadInitialListDepartment(); 
        this.closeAddDepartmentModal();
      },
      (error) => {
        console.error('Error adding department', error);
      }
    );
  }

  addEmployee(employee: any) {
    if(this.isViewing) {
      this.employeeService.updateEmployee(employee).subscribe(
        (response) => {
          this.loadInitialListEmployee();
          this.closeAddEmployeeModal();
        },
        (error) => {
          console.error('Error adding employee', error);
        }
      );
    }
    else{
    this.employeeService.addEmployee(employee).subscribe(
      (response) => {
        this.loadInitialListEmployee();
        this.closeAddEmployeeModal();
      },
      (error) => {
        console.error('Error adding employee', error);
      }
    );
  }
  }

  closeAddDepartmentModal() {
    this.dialog.closeAll();
  }

  closeAddEmployeeModal() {
    this.isViewing = false;
    this.selectedEmployee = { id:'', name: '', email: '', position: '', salary: 0, departmentId: '' };
    this.dialog.closeAll();
  }

  confirmDeleteEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.dialog.open(this.deleteConfirmationModal);
  }

  closeDeleteConfirmationModal() {
    this.dialog.closeAll();
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe(
      (response) => {
        console.log('Employee added:', response);
        this.loadInitialListEmployee();
        this.closeDeleteConfirmationModal();
      },
      (error) => {
        console.error('Error adding employee', error);
      }
    );
  }
}
