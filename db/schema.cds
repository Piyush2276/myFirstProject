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
    //manager    : Association to Employees on delete set null;
    department : Association to Departments;
    division : Association to Divisions;

    
}
