// ===============================
// RAG DEADLOCK DETECTION
// ===============================

// Builds a RAG graph from allocation and request matrices
function buildRAG(data) {
    const { P, R, allocation, request } = data;

    // Graph as adjacency list: key -> [neighbors]
    const graph = {};

    // Initialize all nodes
    for (let i = 0; i < P; i++) graph[`P${i}`] = [];
    for (let j = 0; j < R; j++) graph[`R${j}`] = [];

    // Allocation edges: resource -> process
    for (let i = 0; i < P; i++) {
        for (let j = 0; j < R; j++) {
            if (allocation[i][j] > 0) {
                graph[`R${j}`].push(`P${i}`);
            }
        }
    }

    // Request edges: process -> resource
    for (let i = 0; i < P; i++) {
        for (let j = 0; j < R; j++) {
            if (request[i][j] > 0) {
                graph[`P${i}`].push(`R${j}`);
            }
        }
    }

    return graph;
}

// DFS to detect cycle
function detectCycle(graph) {
    const visited = {};
    const stack = {};

    function dfs(node) {
        visited[node] = true;
        stack[node] = true;

        for (let neighbor of graph[node]) {
            if (!visited[neighbor] && dfs(neighbor)) return true;
            else if (stack[neighbor]) return true;
        }

        stack[node] = false;
        return false;
    }

    for (let node in graph) {
        if (!visited[node] && dfs(node)) {
            return true; // cycle found → deadlock
        }
    }
    return false;
}

// MAIN FUNCTION — called from main.js
function runRAG(data) {
    const textOutput = document.getElementById("textOutput");

    const graph = buildRAG(data);
    const deadlock = detectCycle(graph);

    // Display result
    if (deadlock) {
        textOutput.innerHTML = `<p class="text-danger fw-bold">🔴 Deadlock Detected (Cycle Found)</p>`;
    } else {
        textOutput.innerHTML = `<p class="text-success fw-bold">🟢 No Deadlock (Graph is acyclic)</p>`;
    }

    // Also show the adjacency list for transparency
    let html = `<h6>RAG Graph (Adjacency List)</h6><pre>${JSON.stringify(graph, null, 2)}</pre>`;
    document.getElementById("tableOutput").innerHTML = html;

    // Prepare nodes/edges for visualization
    // visualizeRAG(graph);  <-- We'll implement this in Step 7
}
