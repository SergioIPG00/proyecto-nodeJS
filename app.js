const express = require('express');
const app = express();

const employees = require('./employes.json');

app.get('/api/employees', (req, res) => {

    const page = parseInt(req.query.page) ?? 0;
    const limit = 2;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const results = employees.slice(startIndex, endIndex);

    if(req.query.page != 0 ){        
        res.json(results);
    }else {
        res.json(employees);
    }
    
});

app.get('/api/employees', (req, res) => {
    if (req.query.user === 'true') {
        const userEmployees = employees.filter(emp => emp.privileges === "user");
        return res.json(userEmployees);
    }else{
        return res.json(employees);
    }
});

app.get('/api/employees/oldest', (req, res) => {
    const sortedEmployees = employees.sort((a, b) => b.age - a.age);
    res.json(sortedEmployees[0]);
});

app.use((req, res, next) => {
    res.status(404).json({masagge: "route not found"})
})

app.listen(8080, () =>{
    console.log("ready")
})