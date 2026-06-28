# Deadlock Detection & Prevention Simulator

An interactive, browser-based simulator that demonstrates two classical operating systems algorithms for managing deadlocks — **Resource Allocation Graph (RAG)** cycle detection and **Banker's Algorithm** for deadlock avoidance. No installation required; runs entirely in the browser.

---

## Demo

> Open `index.html` directly in any modern browser — no server, no build step needed.

---

## What It Does

Modern operating systems run multiple processes concurrently, all competing for limited resources (CPU, memory, I/O devices). When processes end up waiting on each other in a circular chain, they deadlock — and the system grinds to a halt.

This simulator lets you configure any number of processes and resource types, enter real allocation/request data, and instantly see whether your system is in a **safe state** or heading toward deadlock.

Two algorithms are implemented:

### 1. Deadlock Detection — Resource Allocation Graph (RAG)

- Builds a directed graph where edges represent resource allocations and process requests
- Runs **DFS-based cycle detection** across the graph
- A cycle = deadlock; the simulator tells you immediately
- Displays the full adjacency list so you can trace exactly which process-resource pair forms the cycle

### 2. Deadlock Avoidance — Banker's Algorithm

- Computes the **Need matrix** (`Max − Allocation`) for each process
- Simulates resource allocation iteratively, checking at every step whether a **safe sequence** exists
- If no safe sequence can be found, the system is flagged as **unsafe** before any allocation is granted
- Displays the complete step-by-step execution log and the final Work vector

---

## How to Use

**Step 1 — Configure the system**
Enter the number of processes (P) and resource types (R), then click **Generate Matrices**.

**Step 2 — Enter resource data**
Fill in four tables that appear:
| Table | What it represents |
|---|---|
| Allocation Matrix (P × R) | Resources currently held by each process |
| Max Matrix (P × R) | Maximum resources each process may ever request |
| Available Vector (1 × R) | Resources currently free in the system |
| Request Matrix (P × R) | Resources each process is currently requesting |

Click **Read Data** to validate your input before running.

**Step 3 — Choose an algorithm**
- Click **Deadlock Detection (RAG)** to check for a cycle in the current allocation graph
- Click **Banker's Algorithm (Avoidance)** to evaluate whether the system is in a safe state

**Step 4 — Run and read results**
Click **Run Selected Algorithm**. Results appear immediately:
- 🟢 Safe state / No deadlock — with the safe sequence (Banker's) or acyclic confirmation (RAG)
- 🔴 Unsafe state / Deadlock detected — with the execution log showing where the system got stuck

---

## Example

With 3 processes and 3 resource types:

| | R0 | R1 | R2 |
|---|---|---|---|
| **Allocation P0** | 0 | 1 | 0 |
| **Allocation P1** | 2 | 0 | 0 |
| **Allocation P2** | 3 | 0 | 2 |

| | R0 | R1 | R2 |
|---|---|---|---|
| **Max P0** | 7 | 5 | 3 |
| **Max P1** | 3 | 2 | 2 |
| **Max P2** | 9 | 0 | 2 |

**Available:** [3, 3, 2]

Running Banker's Algorithm on this input produces the safe sequence: **P1 → P0 → P2**

---

## Project Structure

```
deadlock-simulator/
├── index.html        # UI layout — all four steps, matrix inputs, output panels
├── css/
│   └── style.css     # Minimal styling on top of Bootstrap
└── js/
    ├── main.js       # DOM setup, matrix/vector generation, input reading, algorithm dispatch
    ├── banker.js     # Banker's Algorithm — Need matrix computation, safe sequence search
    └── rag.js        # RAG construction from allocation/request matrices, DFS cycle detection
```

---

## OS Concepts Demonstrated

| Concept | Where |
|---|---|
| Mutual exclusion | Modelled via the Allocation matrix — a resource held by one process is unavailable to others |
| Hold and wait | A process holds resources (Allocation row > 0) while requesting more (Request row > 0) |
| No pre-emption | Resources are only released when a process finishes — enforced by the simulator's logic |
| Circular wait | Detected by DFS cycle detection in the RAG engine |
| Safe state | Evaluated by Banker's Algorithm — a sequence exists where every process can finish |

---

## Tech Stack

- **Vanilla JavaScript** — no frameworks, no dependencies
- **Bootstrap 5** — responsive layout and form styling (CDN)
- All algorithm logic written from scratch in plain JS

---

## What's Next

- [ ] Visual RAG graph rendering (nodes + directed edges using Canvas or D3.js)
- [ ] Animated step-through mode for Banker's Algorithm execution
- [ ] Export results as PDF or CSV
- [ ] Support for multi-instance resources in RAG detection
