INSERT INTO department (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Engineering'),
       ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Rep', 80000, 1),
       ('Marketing Analyst', 81000, 2),
       ('Front End Engineer', 90000, 3),
       ('Director', 79000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mark', 'Willow', 3, 1),
       ('Igor', 'Igrigovich', 4, 1),
       ('Mickey', 'Mouse', 4, 2),
       ('Bianca', 'Green', 2, 2);