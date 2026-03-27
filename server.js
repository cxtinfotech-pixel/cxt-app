const express = require("express");
const fs = require("fs");
const cors = require("cors");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.static("public"));

const FILE = "data.json";

// SAVE
app.post("/save", (req, res) => {
    let data = [];

    if (fs.existsSync(FILE)) {
        data = JSON.parse(fs.readFileSync(FILE));
    }

    data.push(req.body);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    res.send({status: "ok"});
});

// GET LOGS
app.get("/logs", (req, res) => {
    if (!fs.existsSync(FILE)) return res.send([]);
    res.send(JSON.parse(fs.readFileSync(FILE)));
});

// EXPORT
app.get("/export", (req, res) => {
    let data = JSON.parse(fs.readFileSync(FILE));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");

    XLSX.writeFile(wb, "CXT_PAYROLL.xlsx");
    res.download("CXT_PAYROLL.xlsx");
});

app.listen(3000, () => console.log("RUNNING http://localhost:3000"));