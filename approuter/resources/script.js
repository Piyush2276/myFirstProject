let deployAttributes;
let bearerToken; // Global token

const srvUrl =
  "https://478d7af6trial-478d7af6trial-dev-myfirstproject-srv.cfapps.us10-001.hana.ondemand.com";

// 1. Fetch deploy-info and token on page load (but don't fetch data yet)
axios
  .get(`${srvUrl}/deploy-info`)
  .then((response) => {
    console.log("App Content Digest:", response.data);
    deployAttributes = response.data.deployAttributes;
    return fetchJwtToken(
      deployAttributes.authURL,
      deployAttributes.clientID,
      deployAttributes.clientSecret
    );
  })
  .then((token) => {
    bearerToken = token;
    console.log("Bearer token ready:", bearerToken);
  })
  .catch((error) => {
    console.error("Error during initialization:", error);
  });

// Function to fetch JWT token
async function fetchJwtToken(oauthUrl, oauthClient, oauthSecret) {
  const tokenUrl = `${oauthUrl}/oauth/token?grant_type=client_credentials&response_type=token`;
  const config = {
    headers: {
      Authorization: "Basic " + btoa(`${oauthClient}:${oauthSecret}`),
    },
  };

  try {
    const response = await axios.get(tokenUrl, config);
    console.log("JWT Token fetched successfully:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    throw error;
  }
}

// ================= Employee Service Calls =================

const empSrvUrl = `${srvUrl}/odata/v4/employeeService`;

// Fetch Employees
function fetchEmployees() {
  if (!bearerToken) {
    alert("Token not ready yet. Please wait a few seconds.");
    return;
  }
  axios
    .get(`${empSrvUrl}/Employees`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      const employees = response.data.value || response.data;
      const list = document.getElementById("employees-list");
      list.innerHTML = "";
      employees.forEach((emp) => {
        const li = document.createElement("li");
        li.textContent = `${emp.name} | ${emp.email} | Phone: ${emp.phone}`;
        list.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching Employees:", error));
}

// Fetch Departments
function fetchDepartments() {
  if (!bearerToken) {
    alert("Token not ready yet. Please wait a few seconds.");
    return;
  }
  axios
    .get(`${empSrvUrl}/Departments`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      const departments = response.data.value || response.data;
      const list = document.getElementById("departments-list");
      list.innerHTML = "";
      departments.forEach((dep) => {
        const li = document.createElement("li");
        li.textContent = `${dep.ID}: ${dep.name}`;
        list.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching Departments:", error));
}

// Fetch Projects
function fetchProjects() {
  if (!bearerToken) {
    alert("Token not ready yet. Please wait a few seconds.");
    return;
  }
  axios
    .get(`${empSrvUrl}/Projects`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      const projects = response.data.value || response.data;
      const list = document.getElementById("projects-list");
      list.innerHTML = "";
      projects.forEach((proj) => {
        const li = document.createElement("li");
        li.textContent = `${proj.ID}: ${proj.name}`;
        list.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching Projects:", error));
}

// Fetch Managers with Projects (nested expand)
function fetchManagersWithProjects() {
  if (!bearerToken) {
    alert("Token not ready yet. Please wait a few seconds.");
    return;
  }
  axios
    .get(`${empSrvUrl}/ManagersWithProjects?$expand=projects`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      const managers = response.data.value || response.data;
      const list = document.getElementById("managers-projects-list");
      list.innerHTML = "";
      managers.forEach((manager) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${manager.managerName}</strong> (ID: ${manager.managerID})`;

        if (manager.projects) {
          const ul = document.createElement("ul");
          manager.projects.forEach((proj) => {
            const projLi = document.createElement("li");
            projLi.textContent = `Project: ${proj.projectName}`;
            ul.appendChild(projLi);
          });
          li.appendChild(ul);
        }
        list.appendChild(li);
      });
    })
    .catch((error) =>
      console.error("Error fetching Managers with Projects:", error)
    );
}
