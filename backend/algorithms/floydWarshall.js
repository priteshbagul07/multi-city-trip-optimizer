/**
 * Floyd-Warshall All-Pairs Shortest Path Algorithm
 * Time Complexity: O(V^3)
 * Space Complexity: O(V^2)
 */

const INF = Infinity;

function floydWarshall(cities, edges) {
  const n = cities.length;
  const cityIndex = {};
  cities.forEach((city, i) => (cityIndex[city] = i));

  // Initialize distance and next matrices
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  const next = Array.from({ length: n }, () => Array(n).fill(null));

  // Distance to self is 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  // Fill in edges
  for (const edge of edges) {
    const u = cityIndex[edge.from];
    const v = cityIndex[edge.to];
    if (u !== undefined && v !== undefined) {
      dist[u][v] = edge.cost;
      dist[v][u] = edge.cost; // undirected
      next[u][v] = v;
      next[v][u] = u;
    }
  }

  // Floyd-Warshall core
  const steps = [];
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
            steps.push({
              via: cities[k],
              from: cities[i],
              to: cities[j],
              newCost: dist[i][j]
            });
          }
        }
      }
    }
  }

  // Build result matrix
  const result = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        result.push({
          from: cities[i],
          to: cities[j],
          cost: dist[i][j] === INF ? null : dist[i][j],
          path: dist[i][j] === INF ? [] : reconstructPath(next, i, j, cities)
        });
      }
    }
  }

  return { distMatrix: dist, result, steps, cities };
}

function reconstructPath(next, u, v, cities) {
  if (next[u][v] === null) return [];
  const path = [cities[u]];
  while (u !== v) {
    u = next[u][v];
    path.push(cities[u]);
  }
  return path;
}

module.exports = { floydWarshall };
