import con from './db/connection.js'
// ? const inquirer = require('inquirer')
import inquirer from 'inquirer'
import ctable from 'console.table'


con.connect((err) => {
    if (err) throw err
    console.log('Connected')
    con.query('USE employee_tracker', (err) => {
        if (err) throw err
        init()
    })
})

const question = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View Employees',
            'Add Employees',
            'Update Employees Role',
            'View Roles',
            'Add Roles',
            'View Departments',
            'Add Departments',
            'Quit',
        ]
    }
]

const viewEmployee = async () => {
    const queryString = `SELECT employee.first_name, employee.last_name, employee.manager_id AS manager, role.title, role.salary, department.name AS department FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id;`
    const data = await con.promise().query(queryString);
    console.table(data[0])
    init()
}

const addRole = async () => {
    // decide the question
    const table = `SELECT * FROM department;`
    const departmentTable = await con.promise().query(table);
    const departmentChoice = departmentTable[0].map((row) => `${row.id} - ${row.name}`)
    
    const q5 = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary amount?',
        },
        {
            type: 'list',
            name: 'department',
            choices: departmentChoice,
            message: 'What is the name of the department?',
        }]
    // ask the user what the name of the dept is
    inquirer.prompt(q5)
        // then when they give us an answer
        .then( async (input) => {

            // sanity check you input
            

            // extract the users response
            const roleName = input.title;
            const roleSalary = input.salary;
            const roleDepartment = Number(input.department.split('-')[0].trim());

            // put that department name into the db
            
            const queryString = `INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?);`
            const data = await con.promise().query(queryString,[roleName, roleSalary, roleDepartment]);
            
            init()
        });
}

const viewRole = async () => {
    const queryString = `SELECT role.title, role.salary, department.name AS department FROM role 
    INNER JOIN department ON role.department_id = department.id;`
    const data = await con.promise().query(queryString);
    console.table(data[0])
    init()
}

const updateEmployeeRole = async () => {
    // show them a list of employee
    const employeeQ = `SELECT * FROM employee`
    const employeeData = await con.promise().query(employeeQ);
    const employeeChoice = employeeData[0].map((row) => `${row.id} - ${row.first_name} ${row.last_name}`)
    const queryString = `SELECT role.title, role.id FROM role`
    const roleData = await con.promise().query(queryString);
    const roleChoice = roleData[0].map((row) => `${row.id} - ${row.title}`)
    // ask them which employee they want to update (emp id)
    const q4 = [
        {
            type: 'list',
            name: 'employee',
            choices: employeeChoice,
            message: 'What is the first name of the employee?',
        },
        {
            type: 'list',
            name: 'role_id',
            choices: roleChoice,
            message: 'What is the role name of the employee?'
        },

        ]
    // show them a list of roles
    // ask them which role they should change it to (role id)

    // write a sql update statement w/ that info
    // update it in the db
    inquirer.prompt(q4).then( async(input) => {
        const roleId = Number(input.role_id[0]);
        const employeeId = Number(input.employee[0]);
        const queryString = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`
        const data = await con.promise().query(queryString);
        init();
        })
}

const addEmployee = async () => {
    const managerQ = `SELECT * FROM employee`
    const employeeData = await con.promise().query(managerQ);
    const employeeChoice = employeeData[0].map((row) => `${row.id} - ${row.first_name} ${row.last_name}`)
    const queryString = `SELECT role.title, role.id FROM role`
    const roleData = await con.promise().query(queryString);
    const roleChoice = roleData[0].map((row) => `${row.id} - ${row.title}`)
    const q3 = [
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?' 
        },
        {
            type: 'list',
            name: 'role_id',
            choices:  roleChoice,
            message: 'What is the role name of the employee?'
        },
        {
            type: 'list',
            name: 'manager_id',
            choices: employeeChoice,
            message: 'Who is the manager of the employee?'
        },
        ]
    inquirer.prompt(q3).then( async (input) => {
        const firstName = input.first_name;
        const lastName = input.last_name;
        const roleId = Number(input.role_id[0]);
        const managerId = Number(input.manager_id[0]);
        const queryString = 'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)';
        const data = await con.promise().query(queryString, [firstName, lastName, roleId, managerId]);
        
        init()
        })
}

const viewDepartment = async () => {
    const queryString = 'SELECT * FROM department;'
    const data = await con.promise().query(queryString);
    console.table(data[0])
    init()
}

const addDepartment = () => {
    // decide the question
    const q2 = [
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department',
        }]
    // ask the user what the name of the dept is
    inquirer.prompt(q2)
        // then when they give us an answer
        .then((input) => {

            // sanity check you input
            

            // extract the users response
            const deptName = input.department_name;

            // put that department name into the db
            const queryString = `INSERT INTO department(name) VALUES('${deptName}');`
            con.query(queryString, (err, data) => {
                if (err) throw err
                // calling the starting function again so it can prompt more
                init();
            })
        })

}

const init = () => {
    // ask the user what they want to do
    inquirer.prompt(question).then((input) => {
        // react based on their
        // if the user chose view employees
        if (input.choice === 'View Employees') {
        viewEmployee()
        } else if (input.choice === 'Add Employees') {
        addEmployee()
        } else if (input.choice === 'Update Employees Role') {
            // TODO 'Update Emplyoees Role' function
            // call the update emp role funct
            updateEmployeeRole()
        } else if (input.choice === 'View Roles') {
            // TODO 'View All Roles' function
            viewRole() 
        } else if (input.choice === 'Add Roles') {
            // TODO 'Add Roles' function
            addRole()
        }
        else if (input.choice === 'View Departments') {
            viewDepartment()
            // if the user chose add dept
        } else if (input.choice === 'Add Departments') {
            // call the set of instruction to add the department
            addDepartment()
        } else {
            // TODO QUIT
            console.log('Good Riddance')
            process.exit()
        }
    })
} 
