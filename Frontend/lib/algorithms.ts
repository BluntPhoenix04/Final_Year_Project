/* ================================================================
   Pathfinding Algorithms
   Each algorithm returns { visitedNodesInOrder, shortestPath }
   so the canvas can animate the search and then draw the path.
   ================================================================ */

export type GridNode = {
  z: number     // floor index (0 to 3 for floors 1 to 4)
  row: number
  col: number
  isWall: boolean
  isStair: boolean // Marks this node as a staircase capable of vertical traversal
  distance: number
  heuristic: number
  totalDistance: number
  previousNode: GridNode | null
  isVisited: boolean
}

/* ---------- helpers ------------------------------------------------ */

function getAllNodes(grid: GridNode[][][]): GridNode[] {
  const nodes: GridNode[] = []
  for (const floor of grid) {
    for (const row of floor) {
      for (const node of row) {
        nodes.push(node)
      }
    }
  }
  return nodes
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][][]): GridNode[] {
  const neighbors: GridNode[] = []
  const { z, row, col } = node
  const floorGrid = grid[z]
  
  // Horizontal/2D movement
  if (row > 0) neighbors.push(floorGrid[row - 1][col])
  if (row < floorGrid.length - 1) neighbors.push(floorGrid[row + 1][col])
  if (col > 0) neighbors.push(floorGrid[row][col - 1])
  if (col < floorGrid[0].length - 1) neighbors.push(floorGrid[row][col + 1])
  
  // Vertical/3D movement (Stairs)
  if (node.isStair) {
    if (z > 0 && grid[z - 1][row][col].isStair) {
      neighbors.push(grid[z - 1][row][col])
    }
    if (z < grid.length - 1 && grid[z + 1][row][col].isStair) {
      neighbors.push(grid[z + 1][row][col])
    }
  }
  
  return neighbors.filter((n) => !n.isVisited && !n.isWall)
}

export function reconstructPath(endNode: GridNode): GridNode[] {
  const path: GridNode[] = []
  let current: GridNode | null = endNode
  while (current !== null) {
    path.unshift(current)
    current = current.previousNode
  }
  return path
}

/* ---------- Dijkstra ---------------------------------------------- */

export function dijkstra(
  grid: GridNode[][][],
  startNode: GridNode,
  endNode: GridNode
): GridNode[] {
  const visitedNodesInOrder: GridNode[] = []
  startNode.distance = 0
  const unvisitedNodes = getAllNodes(grid)

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance)
    const closest = unvisitedNodes.shift()!

    if (closest.isWall) continue
    if (closest.distance === Infinity) return visitedNodesInOrder

    closest.isVisited = true
    visitedNodesInOrder.push(closest)

    if (closest.z === endNode.z && closest.row === endNode.row && closest.col === endNode.col) {
      return visitedNodesInOrder
    }

    const neighbors = getUnvisitedNeighbors(closest, grid)
    for (const neighbor of neighbors) {
      const alt = closest.distance + 1
      if (alt < neighbor.distance) {
        neighbor.distance = alt
        neighbor.previousNode = closest
      }
    }
  }
  return visitedNodesInOrder
}

/* ---------- A* Search --------------------------------------------- */

function manhattanDistance(a: GridNode, b: GridNode): number {
  const floorDelta = Math.abs(a.z - b.z) * 10 // Heavily weight floor changes so it only uses stairs when necessary
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) + floorDelta
}

export function astar(
  grid: GridNode[][][],
  startNode: GridNode,
  endNode: GridNode
): GridNode[] {
  const visitedNodesInOrder: GridNode[] = []
  startNode.distance = 0
  startNode.heuristic = manhattanDistance(startNode, endNode)
  startNode.totalDistance = startNode.distance + startNode.heuristic

  const openSet: GridNode[] = [startNode]

  while (openSet.length) {
    openSet.sort((a, b) => a.totalDistance - b.totalDistance)
    const current = openSet.shift()!

    if (current.isWall) continue
    if (current.distance === Infinity) return visitedNodesInOrder

    current.isVisited = true
    visitedNodesInOrder.push(current)

    if (current.z === endNode.z && current.row === endNode.row && current.col === endNode.col) {
      return visitedNodesInOrder
    }

    const neighbors = getUnvisitedNeighbors(current, grid)
    for (const neighbor of neighbors) {
      const tentativeG = current.distance + 1
      if (tentativeG < neighbor.distance) {
        neighbor.distance = tentativeG
        neighbor.heuristic = manhattanDistance(neighbor, endNode)
        neighbor.totalDistance = neighbor.distance + neighbor.heuristic
        neighbor.previousNode = current
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        }
      }
    }
  }
  return visitedNodesInOrder
}

/* ---------- BFS --------------------------------------------------- */

export function bfs(
  grid: GridNode[][][],
  startNode: GridNode,
  endNode: GridNode
): GridNode[] {
  const visitedNodesInOrder: GridNode[] = []
  const queue: GridNode[] = [startNode]
  startNode.isVisited = true

  while (queue.length) {
    const current = queue.shift()!
    if (current.isWall) continue

    visitedNodesInOrder.push(current)

    if (current.z === endNode.z && current.row === endNode.row && current.col === endNode.col) {
      return visitedNodesInOrder
    }

    const neighbors = getUnvisitedNeighbors(current, grid)
    for (const neighbor of neighbors) {
      neighbor.isVisited = true
      neighbor.previousNode = current
      queue.push(neighbor)
    }
  }
  return visitedNodesInOrder
}

/* ---------- DFS --------------------------------------------------- */

export function dfs(
  grid: GridNode[][][],
  startNode: GridNode,
  endNode: GridNode
): GridNode[] {
  const visitedNodesInOrder: GridNode[] = []
  const stack: GridNode[] = [startNode]

  while (stack.length) {
    const current = stack.pop()!
    if (current.isVisited || current.isWall) continue

    current.isVisited = true
    visitedNodesInOrder.push(current)

    if (current.z === endNode.z && current.row === endNode.row && current.col === endNode.col) {
      return visitedNodesInOrder
    }

    const neighbors = getUnvisitedNeighbors(current, grid)
    for (const neighbor of neighbors) {
      neighbor.previousNode = current
      stack.push(neighbor)
    }
  }
  return visitedNodesInOrder
}
