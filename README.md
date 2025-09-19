Project Employees management system
1. Entities are {Employees, Address, Department , Division, Projects}
2. CURD on all entities
3. Each project has a manager and he should be an employee.
4. when a manager is deleted then for all the employees under that manager the manager_ID should become null.
5. When employee is deleted then his/her address also should be deleted.(TESTED)
6. email & phone no. validation.(TESTED)



to do 
1. 
    a) create projects, allote projects to employees, allote manager to a project 
    b) update manager to a project 
    c) creation association bet employee and project, when project is deleted it should also be de-alloted from an  employee
    d) Display list of employees for each project. (To do)
    e) Display list of Projects under each manager.(To Do )


2. Fetch these employee name , email , dep name , div name, manager name in a single call.
    {
  "name": "Bob Kumar",
  "email": "bob123@gmail.com",
  "departmentName": "Quality Assurance",
  "division": null,
  "managerName": "Piyush Singh"
    } (To DO) 

3. create one action and one function 
 function should return only selected fields.

4. use hana database.

// srv.on("Read", "Employees", async(req,next)=>{
    //     const result = await next();

    //     return result.map(emp =>{
    //         name:emp.name;
    //         email :emp.email;
    //         department : emp.department?.name || null;
    //         division : emp.division?.name || null;
    //         manager : emp.manager?.name || null;

    //     });
    // });

entity Employee {
  key ID: UUID;
  name: String;
  email: String;
  manager: Association to Employee;
  department: Association to Department;
  projects: Association to many ProjectEmployee on projects.employee = $self;
  address: Composition of one Address on address.employee = $self;
}

entity Project {
  key ID: UUID;
  name: String;
  project_manager: Association to Employee;
}

entity ProjectEmployee {
  key project_ID: UUID;
  key employee_ID: UUID;
  project: Association to Project on project_ID = project.ID;
  employee: Association to Employee on employee_ID = employee.ID;
}

1) show by creating  associations one to one, one to many, many to many