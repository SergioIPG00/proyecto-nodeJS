const express = require('express');
const app = express();

const employees = require('./employes.json');

const Joi = require('joi');

app.use(express.json());

const employeeSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(0).required(),
    phone: Joi.object({
        personal: Joi.string().required(),
        work: Joi.string().required(),
        ext: Joi.string().required()
    }).required(),
    privileges: Joi.string().required(),
    favorites: Joi.object({
        artist: Joi.string().required(),
        food: Joi.string().required()
    }).required(),
    finished: Joi.array().items(Joi.number().min(0)).required(),
    badges: Joi.array().items(Joi.string()).required(),
    points: Joi.array().items(
        Joi.object({
            points: Joi.number().min(0).required(),
            bonus: Joi.number().min(0).required()
        })
    ).required()
});

app.get('/api/employees', (req, res) => {

    const page = req.query.page ? parseInt(req.query.page) : 0;
    const user = req.query.user ? req.query.user : 'false';
    const badges = req.query.badges ? req.query.badges : '';
    const limit = 2;

    let results = employees;

    if(page === 0 && user === 'false' && badges === '') {
        return res.json(employees);
    }else if(page != 0){
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        results = employees.slice(startIndex, endIndex);
    }else if (user === 'true') {
        results = employees.filter(emp => emp.privileges === "user");
    }else if (badges != '') {
        results = employees.filter(emp => emp.badges && emp.badges.includes(badges));        
    }
    res.json(results);    
    
});

app.get('/api/employees/oldest', (req, res) => {
    const sortedEmployees = employees.sort((a, b) => b.age - a.age);
    res.json(sortedEmployees[0]);
});

app.get('/api/employees/name', (req, res) => {
    if(req.query.name != ''){
        results = employees.find(emp=> emp.name.toLowerCase() === req.query.name.toLowerCase());
        if(results){
            res.json(results);
        }else{
            res.status(404).json({ code: "not_found" });
        }
    }
});

app.post('/api/employees', (req, res) => {
    const { error } = employeeSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ code: "bad_request" });
    }

    employees.push(req.body);

    res.json(req.body);
});

app.use((req, res, next) => {
    res.status(404).json({masagge: "route not found"})
})

app.listen(8080, () =>{
    console.log("ready")
})