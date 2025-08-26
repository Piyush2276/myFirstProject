using { hr as db } from '../db/schema';

@path:'employeeService'

service EmployeeService {
    entity Divisions as projection on db.Divisions;
    entity Departments as projection on db.Departments;
    entity Employees as projection on db.Employees;
    
}