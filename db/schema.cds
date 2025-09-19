namespace hr; 

using { cuid, managed } from '@sap/cds/common'; 

entity Divisions : cuid, managed {
    name : String(100);
    departments : Composition of many Departments on departments.division = $self;
    
}
entity Departments : cuid , managed {
    name : String(100);
    division : Association to Divisions;
    employees : Association to many Employees on employees.department = $self;

}

entity Employees : cuid , managed {
    name : String;
    email : String;
    phone : String;
    manager    : Association to Employees;

    //this on delete set null doesnot work on local it only work on hana
    //department : Association to Departments on delete set null ;
    department : Association to Departments;
    division : Association to Divisions;
    address : Composition of one Address on address.employee = $self;
    project : Association to many ProjectEmployee on project.employee = $self;
}

entity Address : cuid, managed {
    city : String;
    state : String;
    employee : Association to Employees;

}

entity Projects : cuid , managed{
    name : String;
    department : Association to Departments;
    division : Association to Divisions;
    manager  : Association to Employees;
     employees  : Association to many ProjectEmployee on employees.project = $self;
    
}
entity ProjectEmployee {
  key project_ID: UUID;
  key employee_ID: UUID;
  project: Association to Projects on project_ID = project.ID;
  employee: Association to Employees on employee_ID = employee.ID;
}
