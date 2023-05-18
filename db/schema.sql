CREATE DATABASE IF NOT EXISTS employee_tracker; 
USE employee_tracker;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;


CREATE TABLE department(
    id int auto_increment not null,
    name VARCHAR(30) not null,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id int auto_increment not null,
    title VARCHAR(30) not null,
    salary DECIMAL not null,
    department_id INT not null,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) references department(id)    
);

CREATE TABLE employee(
    first_name VARCHAR(30) not null, 
    last_name VARCHAR(30) not null,
    role_id INT not null,
    manager_id INT not null,
    id int auto_increment not null,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) references role(id),
    FOREIGN KEY(manager_id) references employee(id)
);

