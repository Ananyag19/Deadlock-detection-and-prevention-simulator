// =================================
// BANKER'S ALGORITHM (DEADLOCK AVOIDANCE)
// =================================

function runBanker(data) {
    const { P, R, allocation, max, available } = data;

    // Compute Need matrix = Max - Allocation
    const need = [];
    for (let i = 0; i < P; i++) {
        need[i] = [];
        for (let j = 0; j < R; j++) {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }

    // Work = Available (copy)
    let work = available.slice();
    let finish = Array(P).fill(false);
    let safeSequence = [];
    let steps = [];

    // Banker's core loop
    while (safeSequence.length < P) {
        let allocatedThisRound = false;

        for (let i = 0; i < P; i++) {
            if (!finish[i]) {
                // Check if Need[i] <= Work
                let canRun = true;
                for (let j = 0; j < R; j++) {
                    if (need[i][j] > work[j]) {
                        canRun = false;
                        break;
                    }
                }

                if (canRun) {
                    // “Allocate” and release resources
                    for (let j = 0; j < R; j++) {
                        work[j] += allocation[i][j];
                    }

                    finish[i] = true;
                    safeSequence.push(i);
                    allocatedThisRound = true;

                    steps.push(`Process P${i} can safely run. Work becomes [${work.join(", ")}]`);
                }
            }
        }

        if (!allocatedThisRound) {
            // No process could be allocated in this loop → unsafe state
            break;
        }
    }

    const textOutput = document.getElementById("textOutput");
    const tableOutput = document.getElementById("tableOutput");
    tableOutput.innerHTML = "";

    // Final result
    if (safeSequence.length === P) {
        textOutput.innerHTML = `
            <p class="text-success fw-bold">🟢 Safe State</p>
            <p>Safe Sequence: <strong>${safeSequence.map(i => "P" + i).join(" → ")}</strong></p>
        `;
    } else {
        textOutput.innerHTML = `
            <p class="text-danger fw-bold">🔴 Unsafe State — No Safe Sequence Exists</p>
        `;
    }

    // Show detailed step log
    let logHTML = `<h5>Execution Steps</h5><ul>`;
    steps.forEach(step => {
        logHTML += `<li>${step}</li>`;
    });
    logHTML += `</ul>`;
    tableOutput.innerHTML += logHTML;

    // Show Need matrix
    tableOutput.innerHTML += `<h5>Need Matrix</h5>`;
    tableOutput.appendChild(buildMatrixTable(need, P, R));

    // Show Work vector after completion
    tableOutput.innerHTML += `<h5>Final Work Vector</h5>`;
    tableOutput.appendChild(buildVectorTable(work));

}


// Helper to build P×R tables
function buildMatrixTable(matrix, P, R) {
    const table = document.createElement("table");
    table.className = "table table-bordered";

    let html = `<thead><tr><th></th>`;
    for (let j = 0; j < R; j++) html += `<th>R${j}</th>`;
    html += `</tr></thead><tbody>`;

    for (let i = 0; i < P; i++) {
        html += `<tr><th>P${i}</th>`;
        for (let j = 0; j < R; j++) {
            html += `<td>${matrix[i][j]}</td>`;
        }
        html += `</tr>`;
    }

    html += `</tbody>`;
    table.innerHTML = html;
    return table;
}

function buildVectorTable(vec) {
    const table = document.createElement("table");
    table.className = "table table-bordered";

    let html = "<thead><tr>";
    vec.forEach((_, j) => {
        html += `<th>R${j}</th>`;
    });
    html += "</tr></thead><tbody><tr>";

    vec.forEach(val => {
        html += `<td>${val}</td>`;
    });

    html += "</tr></tbody>";
    table.innerHTML = html;
    return table;
}
