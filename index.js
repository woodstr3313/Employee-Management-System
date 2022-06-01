const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

const connection = mysql.createConnection(
  {
    host: "localhost",
    port: 3001,
    user: "root",
    password: "FBktj0526!",
    database: "employee_db",
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
    "SELECT employees.firstName, employees.lastName, roles.title, roles.salary, departments.name, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employees INNER JOIN roles on roles.id = employees.roleId INNER JOIN departments on departments.id = roles.departmentId left join employees e on employees.managerId = e.id;",
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
    "SELECT employees.firstName, employees.lastName, departments.name AS Departments FROM employees JOIN roles ON employees.roleId = roles.id JOIN departments ON roles.departmentId = departments.id ORDER BY employees.id;",
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
    "SELECT employees.firstName, employees.lastName, roles.title AS Title FROM employees JOIN roles ON employees.roleId = roles.id;",
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
  connection.query("SELECT * FROM roles", function (err, res) {
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
    "SELECT first_name, last_name FROM employees WHERE manager_id IS NULL",
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
        "INSERT INTO employees SET?",
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
// UPDATE EMPLOYEE
function updateEmployee() {
  connection.query(
    "SELECT employees.lastName, roles.title FROM employees JOIN roles ON employees.roleId = roles.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the last name of the Employee? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the new title of the Employee? ",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          var roleId = selectRole().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employees SET WHERE?",
            {
              last_name: val.lastName,
            },
            {
              role_id: roleId,
            },
            function (err) {
              if (err) throw err;
              console.table(val);
              startPrompt();
            }
          );
        });
    }
  );
}
// ADD DEPARTMENT
function addDepartment() { 
    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Add a new department?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO departments SET ? ",
            {
              name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }
// ADD EMPLOYEE ROLE
function addRole() { 
    connection.query("SELECT roles.title AS Title, roles.salary AS Salary FROM roles",   function(err, res) {
      inquirer.prompt([
          {
            name: "Title",
            type: "input",
            message: "What is the title of the role?"
          },
          {
            name: "Salary",
            type: "input",
            message: "What is the Salary?"
  
          } 
      ]).then(function(res) {
          connection.query(
              "INSERT INTO roles SET?",
              {
                title: res.Title,
                salary: res.Salary,
              },
              function(err) {
                  if (err) throw err
                  console.table(res);
                  startPrompt();
              }
          )
      });
    });
    }
