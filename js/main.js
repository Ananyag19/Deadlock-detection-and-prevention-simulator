// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateMatricesBtn");
    const readDataBtn = document.getElementById("readDataBtn");

    generateBtn.addEventListener("click", generateMatrices);
    readDataBtn.addEventListener("click", readDataAndTest);

    // Later we will connect algorithm buttons:
    document.getElementById("btnRAG").addEventListener("click", () => selectAlgorithm("RAG"));
    document.getElementById("btnBanker").addEventListener("click", () => selectAlgorithm("BANKER"));
    document.getElementById("runAlgorithmBtn").addEventListener("click", runSelectedAlgorithm);
});

let currentAlgorithm = null;

// Utility to select algorithm
function selectAlgorithm(algo) {
    currentAlgorithm = algo;

    const textOutput = document.getElementById("textOutput");
    textOutput.innerHTML = `<p><strong>Selected Algorithm:</strong> ${algo}</p>`;
}

// STEP 3.1: Generate matrix tables based on P and R
function generateMatrices() {
    const P = parseInt(document.getElementById("numProcesses").value, 10);
    const R = parseInt(document.getElementById("numResources").value, 10);

    if (isNaN(P) || isNaN(R) || P <= 0 || R <= 0) {
        alert("Please enter valid positive numbers for processes and resources.");
        return;
    }

    createMatrixTable("allocationMatrixContainer", "alloc", P, R, "Allocation");
    createMatrixTable("maxMatrixContainer", "max", P, R, "Max");
    createVectorInputs("availableVectorContainer", "avail", R, "Available");
    createMatrixTable("requestMatrixContainer", "req", P, R, "Request");

    document.getElementById("readDataStatus").innerText = "";
}

// Create P x R matrix
function createMatrixTable(containerId, prefix, rows, cols, label) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // clear previous

    const table = document.createElement("table");
    table.className = "table table-bordered table-sm matrix-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const emptyTh = document.createElement("th");
    emptyTh.textContent = "";
    headerRow.appendChild(emptyTh);

    for (let j = 0; j < cols; j++) {
        const th = document.createElement("th");
        th.textContent = `R${j}`;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");

        const rowHeader = document.createElement("th");
        rowHeader.textContent = `P${i}`;
        tr.appendChild(rowHeader);

        for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.className = "form-control form-control-sm";
            input.id = `${prefix}_${i}_${j}`;
            td.appendChild(input);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
}

// Create 1 x R vector
function createVectorInputs(containerId, prefix, length, label) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const rowDiv = document.createElement("div");
    rowDiv.className = "d-flex gap-2 align-items-center";

    for (let j = 0; j < length; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.className = "form-control form-control-sm";
        input.style.width = "60px";
        input.id = `${prefix}_${j}`;
        input.placeholder = `R${j}`;
        rowDiv.appendChild(input);
    }

    container.appendChild(rowDiv);
}
function readDataAndTest() {
    try {
        const data = readSystemData();
        console.log("System Data:", data);
        document.getElementById("readDataStatus").innerText = "Data read successfully!";
        document.getElementById("readDataStatus").classList.remove("text-danger");
        document.getElementById("readDataStatus").classList.add("text-success");

        // Also show a brief summary in textOutput for confirmation
        const textOutput = document.getElementById("textOutput");
        textOutput.innerHTML = `
          <p><strong>Data loaded:</strong> P = ${data.P}, R = ${data.R}</p>
          <p>Allocation[0]: [${data.allocation[0].join(", ")}] (if exists)</p>
        `;
    } catch (err) {
        alert(err.message);
        document.getElementById("readDataStatus").innerText = "Error reading data!";
        document.getElementById("readDataStatus").classList.remove("text-success");
        document.getElementById("readDataStatus").classList.add("text-danger");
    }
}

function readSystemData() {
    const P = parseInt(document.getElementById("numProcesses").value, 10);
    const R = parseInt(document.getElementById("numResources").value, 10);

    if (isNaN(P) || isNaN(R) || P <= 0 || R <= 0) {
        throw new Error("Invalid P or R. Please generate matrices first.");
    }

    // Helper to read a P x R matrix
    function readMatrix(prefix) {
        const matrix = [];
        for (let i = 0; i < P; i++) {
            const row = [];
            for (let j = 0; j < R; j++) {
                const id = `${prefix}_${i}_${j}`;
                const input = document.getElementById(id);
                if (!input) {
                    throw new Error(`Missing input: ${id}. Click "Generate Matrices" again.`);
                }
                const val = parseInt(input.value || "0", 10);
                if (val < 0 || isNaN(val)) {
                    throw new Error(`Invalid value at ${id}.`);
                }
                row.push(val);
            }
            matrix.push(row);
        }
        return matrix;
    }

    // Helper to read vector of length R
    function readVector(prefix) {
        const vec = [];
        for (let j = 0; j < R; j++) {
            const id = `${prefix}_${j}`;
            const input = document.getElementById(id);
            if (!input) {
                throw new Error(`Missing input: ${id}.`);
            }
            const val = parseInt(input.value || "0", 10);
            if (val < 0 || isNaN(val)) {
                throw new Error(`Invalid value at ${id}.`);
            }
            vec.push(val);
        }
        return vec;
    }

    const allocation = readMatrix("alloc");
    const max = readMatrix("max");
    const request = readMatrix("req");
    const available = readVector("avail");

    const data = { P, R, allocation, max, request, available };
    return data;
}
function runSelectedAlgorithm() {
    if (!currentAlgorithm) {
        alert("Please select an algorithm first.");
        return;
    }

    let data;
    try {
        data = readSystemData();
    } catch (err) {
        alert(err.message);
        return;
    }

    const textOutput = document.getElementById("textOutput");
    const tableOutput = document.getElementById("tableOutput");
    const graphContainer = document.getElementById("graphContainer");

    // Clear previous
    tableOutput.innerHTML = "";
    graphContainer.innerHTML = "";

    if (currentAlgorithm === "RAG") {
        runRAG(data);
    } else if (currentAlgorithm === "BANKER") {
        runBanker(data);
    }
}
