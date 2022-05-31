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

// Prompts user with a list of questions.
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
          viewAllEmployees();
          break;

        case "View All Employees By Departments?":
          viewAllDepartments();
          break;
        case "View all Employees By Roles":
          viewAllRoles();
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

