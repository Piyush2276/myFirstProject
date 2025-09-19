using {hr as db} from '../db/schema';

@path: 'employeeService'

service EmployeeService {
    entity Divisions   as projection on db.Divisions;
    @require : 'Viewer'
    entity Departments as projection on db.Departments;
    @cds.redirection.target
    entity Employees   as projection on db.Employees;
    entity Address     as projection on db.Address;
    @cds.redirection.target
    entity Projects    as projection on db.Projects;
    entity ProjectEmployee as projection on db.ProjectEmployee;
    //Action 
    action updateEmployeePhone(employeeID: UUID, newPhone: String) returns Boolean;
    //Function
    
    function getEmployeesByDepartment(departmentID: UUID) returns array of Employees;

    entity EmployeeView as projection on Employees{
        key name,
        email,
        department.name as department,
        manager.name as manager,
        division.name as division
    };

    // Helper view for projects with manager
    entity ProjectsView as projection on db.Projects {
        ID   as projectID,
        name as projectName,
        manager
    };

    // Managers with nested projects
    entity ManagersWithProjects as select from db.Employees {
    ID   as managerID,
    name as managerName,
    projects : Association to many ProjectsView on projects.manager.ID = managerID
    };
};