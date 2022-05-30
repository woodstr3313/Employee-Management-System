const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const util = require("util");
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

connection.connect((err) => {
  if (err) throw err;
  console.log(" ");
  start();
});

const queryAsync = util.promisify(connection.query).bind(connection);

// Prompts user with a list of questions.
async function start() {
  const answer = await inquirer.prompt({
    name: "selectOption",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Delete a department",
      "Delete a role",
      "Delete an employee",
      "Update a role salary",
      "Update employee role",
      "Update employee manager",
      "Exit",
    ],
  });

  switch (answer.selectOption) {
    case "View all departments":
      viewDepartments();
      break;
    case "View all roles":
      viewRoles();
      break;
    case "View all employees":
      viewEmployees();
      break;
    case "Add a department":
      addDepartment();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add an employee":
      addEmployee();
      break;
    case "Delete a department":
      deleteDepartment();
      break;
    case "Delete a role":
      deleteRole();
      break;
    case "Delete an employee":
      deleteEmployee();
      break;
    case "Update a role salary":
      updateSalary();
      break;
    case "Update employee role":
      updateRole();
      break;
    case "Update employee manager":
      updateManager();
      break;
    case "Exit":
      console.log("Goodbye!");
      Connection.end();
      break;
  }
}
