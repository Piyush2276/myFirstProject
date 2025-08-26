const cds = require("@sap/cds");

module.exports = srv => {
    const {Employees, Departments} =srv.entities;

    srv.before("DELETE","Departments", async(req)=>{
        const { ID } = req.params;
        await UPDATE(Employees)
         .set({ department_ID: null })
         .where({ department_ID: ID });
    });
};