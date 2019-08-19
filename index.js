const express = require("express");

const app = express();

app.use(express.json());

const projects = [];

let reqQuan = 0;

// MiddleWare Global
app.use((req, res, next) => {
    console.log(`Quantity of requisitions: ${reqQuan++}`);
    return next();
});

// MiddleWare Local
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
        res.status(400).json({ error: "Project not found" });
    }

    return next();
}

app.post("/projects", (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

app.get("/projects", (req, res) => {
    return res.json(projects);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

app.delete("/projects/:id", (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

app.post("/projects/:id/tasks", (req, res) => {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    project.tasks.push(req.body.title);

    return res.json(project);
});

app.listen(3333);