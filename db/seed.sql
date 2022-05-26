USE employeeDB;

INSERT INTO department (name)
VALUES ('Finance'), ('Marketing'), ('HR'), ('Sales'), ('Design');

INSERT INTO role (title, salary, departmentId)
VALUES ('Financial Officer', 120000, 1), ('Marketing Manager', 85000, 2), ('Rep', 50000, 3), ('Sales Lead', 90000, 4), ('Web Designer', 65000, 5), ('DevOps Engineer', 100000, 5), ('Design Manager', 150000, 5);

INSERT INTO employee (firstName, lastName, roleId)
VALUE ('Travis', 'Woods', 1), ('Jon', 'Adams', 2), ('Billy', 'Pease', 3), ('Fred', 'Woods', 4), ('Rudy', 'Basset', 5), ('Adam', 'Johnson', 6), ('Tina', 'Shiller', 7);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUE ('Lauren', 'Marvin', 1, 1), ('Steve', 'Jobs', 2, 3), ('Elon', 'Musk', 5, 4);