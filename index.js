const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

const connection = mysql.createConnection(
  {
    host: "localhost",
    port: 3001,
    user: "root",
    password: "",
    database: "employee_DB",
  },
  console.log("Connected to Employee Database.")
);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected" + connection.threadId);
  startPrompt();
});

// PROMPTS USER WITH QUESTIONS.
function startPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View All Employees?",
          "View all Employees By Deparments",
          "View all Employees By Roles",
          "Add Employee?",
          "Update Employee",
          "Add Department?",
          "Add Role?",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees?":
          showAllEmployees();
          break;

        case "View All Employees By Departments?":
          showAllDepartments();
          break;

        case "View all Employees By Roles":
          showAllRoles();
          break;

        case "Add Employee?":
          addEmployee();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "Add Department?":
          addDepartment();
          break;

        case "Add Role?":
          addRole();
          break;
      }
    });
}

// SHOW ALL EMPLOYEES
function showAllEmployees() {
  connection.query(
    "SELECT employee.firstName, employee.lastName, role.title, role.salary, department.name, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employee INNER JOIN role on role.id = employee.roleId INNER JOIN department on department.id = role.departmentId left join employee e on employee.managerId = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
// SHOW ALL EMPLOYEES BY DEPARTMENT
function showAllDepartments() {
  connection.query(
    "SELECT employee.firstName, employee.lastName, department.name AS Department FROM employee JOIN role ON employee.roleId = role.id JOIN department ON role.departmentId = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
// SHOW ALL ROLES
function showAllRoles() {
  connection.query(
    "SELECT employee.firstName, employee.lastName, role.title AS Title FROM employee JOIN role ON employee.roleId = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//  SELECT ROLE FOR ADD EMPLOYEE PROMPT
var roleArray = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
  });
  return roleArray;
}
// SELECT ROLE MANAGER ADD EMPLOYEE PROMPT
var managersArray = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArray.push(res[i].first_name);
      }
    }
  );
  return managersArray;
}
// ADD EMPLOYEE
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the first name ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the last name ",
      },
      {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "Whats their managers name?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1;
      var managerId = selectManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          firstName: val.firstName,
          lastName: val.lastName,
          managerId: managerId,
          roleId: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}
