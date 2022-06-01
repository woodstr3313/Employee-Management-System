-- DEPARTMENT SEEDS
INSERT INTO departments (departmentName)
VALUES ('Finance');
INSERT INTO departments (departmentName)
VALUES ('Marketing'); 
INSERT INTO departments (departmentName)
VALUES  ('HR');
INSERT INTO departments (departmentName)
VALUES  ('Sales');
INSERT INTO departments (departmentName)
VALUES  ('Design');
-- EMPLOYEE ROLE SEEDS
INSERT INTO roles (title, salary, departmentId)
VALUE ('Financial Officer', 120000, 1);
INSERT INTO roles (title, salary, departmentId)
VALUE ('Marketing Manager', 85000, 2);
INSERT INTO roles (title, salary, departmentId)
VALUE ('Sales Rep', 50000, 3);
INSERT INTO roles (title, salary, departmentId)
VALUE ('Sales Lead', 90000, 4);
INSERT INTO roles (title, salary, departmentId)
VALUE ('Web Designer', 65000, 5);
INSERT INTO roles (title, salary, departmentId)
VALUE ('DevOps Engineer', 100000, 5);
INSERT INTO roles (title, salary, departmentId)
 VALUE ('Design Manager', 150000, 5);
--  EMPLOYEE SEEDS
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Travis', 'Woods', 1, null);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Jon', 'Adams', 2, null);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Billy', 'Pease', 3, null);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Fred', 'Woods', 4, 3);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Rudy', 'Basset', 5, 2);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Adam', 'Johnson', 6, 1);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Tina', 'Shiller', 7, null);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Steve', 'Jobs', 2, 3);
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Lauren', 'Marvin', 1, 1); 
INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUE ('Elon', 'Musk', 5, 4);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;