const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
// const db = require('./db')
const connection = mysql.createConnection(
  {
    host: "localhost",
    // port: 3001,
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
          "View All Employees By Departments?",
          "View all Employees By Roles?",
          "Add Employee?",
          "Update Employee?",
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

        case "View all Employees By Roles?":
          showAllRoles();
          break;

        case "Add Employee?":
          addEmployee();
          break;

        case "Update Employee?":
          updateEmployee();
          break;

        case "Add Department?":
          addDepartment();
          break;

        case "Add Role?":
          addRole();
          break;
        default:
          console.log("didnt find a match");  
      }
    });
}

// SHOW ALL EMPLOYEES
function showAllEmployees() {
  connection.query(
    "SELECT employees.firstName, employees.lastName, roles.title, roles.salary, departments.departmentName, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employees INNER JOIN roles on roles.id = employees.roleId INNER JOIN departments on departments.id = roles.departmentId left join employees e on employees.managerId = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
// SHOW ALL EMPLOYEES BY DEPARTMENT
function showAllDepartments() {
  // console.log("Got here")
  connection.query(
    "SELECT employees.firstName, employees.lastName, departments.departmentName AS Departments FROM employees JOIN roles ON employees.roleId = roles.id JOIN departments ON roles.departmentId = departments.id ORDER BY employees.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    }
  )
}
// SHOW ALL ROLES
function showAllRoles() {
  connection.query(
    "SELECT employees.firstName, employees.lastName, roles.title AS Role FROM employees JOIN roles ON employees.roleId = roles.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//  SELECT ROLE FOR ADD EMPLOYEE PROMPT
function selectRole() {
  var roleArray = [];
  connection.query("SELECT * FROM roles", 
  function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
  });
  return roleArray;
}
// SELECT ROLE MANAGER ADD EMPLOYEE PROMPT
function selectManager() {
  var managersArray = [];
  connection.query(
    "SELECT firstName, lastName FROM employees WHERE managerId IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArray.push(res[i].firstName);
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
      console.log(selectRole());
      console.log(val.role);

      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      console.log(roleId, managerId);
      // connection.query("SET GLOBAL FOREIGN_KEY_CHECKS = 0")
      connection.query(
        
        "INSERT INTO employees SET ?",
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
// "SET GLOBAL FOREIGN_KEY_CHECKS = 0";
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
                lastName.push(res[i].lastName);
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
            "UPDATE employees SET WHERE ?",
            {
              lastName: val.LastName
            },
            {
              roleId: roleId
            },
            function (err) {
              if (err) throw err
              console.table(val)
              startPrompt();
            }
          )
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
          message: "What is the name of the new department?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO departments SET ? ",
            {
              departmentName: res.DepartmentName
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
    connection.query("SELECT roles.title AS Title, roles.salary AS Salary FROM roles",   
    function(err, res) {
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
