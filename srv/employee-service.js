const cds = require("@sap/cds");

module.exports = srv => {
    const { Employees, Projects } = srv.entities;

    srv.before("DELETE", "Departments", async (req) => {
        const ID = req.data.ID;
        if (!ID) return;

        await UPDATE(Employees)
            .set({ department_ID: null })
            .where({ department_ID: ID });
    });

    srv.before("DELETE", "Employees", async (req) => {
        const ID = req.data.ID;

        //console.log(`ID : ${ID}`);

        if (!ID) return;

        await UPDATE(Employees)
            .set({ manager_ID: null })
            .where({ manager_ID: ID });
    });

    srv.before("CREATE", "Employees", async (req) => {
        const { email, phone } = req.data;

        // Regex for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.error(400, `Invalid email format: ${email}`);
        }

        // Regex for phone (e.g., Indian +91 format)
        const phoneRegex = /^\+91-\d{10}$/;
        if (!phoneRegex.test(phone)) {
            req.error(400, "Invalid phone number format! Use +91-XXXXXXXXXX");
        }
    });

    srv.before("DELETE","Projects" , async(req)=>{
        const ID = req.data.ID;

        if(!ID) return;

        await cds.run(
            UPDATE(Employees).set({project_ID : null}).where({project_ID : ID}));
    });

    srv.on("updateEmployeePhone", async(req)=>{

        const{employeeID, newPhone} =req.data;

        // Regex for phone (e.g., Indian +91 format)
        const phoneRegex = /^\+91-\d{10}$/;
        if (!phoneRegex.test(newPhone)) {
            req.error(400, "Invalid phone number format! Use +91-XXXXXXXXXX");
        }

        await UPDATE(Employees)
        .set({phone : newPhone})
        .where({ID:employeeID});

        return true;
    });

    srv.on("getEmployeesByDepartment", async(req)=>{
        const {departmentID}= req.data;

        const employees = await SELECT.from(Employees).where({department_ID: departmentID});
        return employees;
    });
    

};
