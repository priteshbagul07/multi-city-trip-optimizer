import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const NODE_R = 22;

const GraphCanvas = ({ cities, edges, highlightPath }) => {
  const fgRef = useRef();
  const containerRef = useRef();

  const graphData = React.useMemo(() => {
    const nodes = cities.map((city) => ({ id: city, label: city }));
    const links = edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
      cost: edge.cost,
    }));
    return { nodes, links };
  }, [cities, edges]);

  const highlightSet = React.useMemo(() => {
    if (!highlightPath || highlightPath.length === 0)
      return { nodes: new Set(), links: new Set() };
    const nodeSet = new Set(highlightPath);
    const linkSet = new Set();
    for (let i = 0; i < highlightPath.length - 1; i++) {
      linkSet.add(`${highlightPath[i]}||${highlightPath[i + 1]}`);
      linkSet.add(`${highlightPath[i + 1]}||${highlightPath[i]}`);
    }
    return { nodes: nodeSet, links: linkSet };
  }, [highlightPath]);

  // Strong repulsion so nodes spread out
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-600);
      fgRef.current.d3Force('link').distance(160);
      fgRef.current.d3Force('collide') && fgRef.current.d3Force('collide').radius(60);
    }
  }, [graphData]);

  const nodeCanvasObject = useCallback(
    (node, ctx, globalScale) => {
      const isHighlighted = highlightSet.nodes.has(node.id);
      const label = node.label;

      // Outer glow ring
      if (isHighlighted) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R + 10, 0, 2 * Math.PI);
        const grad = ctx.createRadialGradient(
          node.x, node.y, NODE_R,
          node.x, node.y, NODE_R + 10
        );
        grad.addColorStop(0, 'rgba(0,229,255,0.5)');
        grad.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted
        ? '#00e5ff'
        : 'rgba(76, 29, 149, 0.95)';
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#ffffff' : '#7c3aed';
      ctx.lineWidth = isHighlighted ? 3 : 2;
      ctx.stroke();

      // First letter inside
      ctx.font = `bold 14px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHighlighted ? '#000' : '#e9d5ff';
      ctx.fillText(label.charAt(0).toUpperCase(), node.x, node.y);

      // Full label below node — with background
      ctx.font = `bold 12px Arial`;
      const tw = ctx.measureText(label).width;
      const lx = node.x;
      const ly = node.y + NODE_R + 10;
      const padX = 6, padY = 4;

      // Background pill
      ctx.fillStyle = isHighlighted
        ? 'rgba(0,229,255,0.18)'
        : 'rgba(13,13,24,0.9)';
      ctx.strokeStyle = isHighlighted ? 'rgba(0,229,255,0.6)' : 'rgba(60,60,90,0.8)';
      ctx.lineWidth = 1;
      const bx = lx - tw / 2 - padX;
      const by = ly - padY;
      const bw = tw + padX * 2;
      const bh = 12 + padY * 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, bw, bh, 5);
      } else {
        ctx.rect(bx, by, bw, bh);
      }
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = isHighlighted ? '#00e5ff' : '#c4b5fd';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, lx, ly);
    },
    [highlightSet]
  );

  const linkCanvasObject = useCallback(
    (link, ctx) => {
      const srcId = link.source.id || link.source;
      const tgtId = link.target.id || link.target;
      const isHighlighted =
        highlightSet.links.has(`${srcId}||${tgtId}`) ||
        highlightSet.links.has(`${tgtId}||${srcId}`);

      const sx = link.source.x ?? 0;
      const sy = link.source.y ?? 0;
      const ex = link.target.x ?? 0;
      const ey = link.target.y ?? 0;

      // Draw edge line
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = isHighlighted ? '#00e5ff' : 'rgba(100,100,160,0.6)';
      ctx.lineWidth = isHighlighted ? 3 : 1.5;
      ctx.stroke();

      // Cost badge — only if nodes are far enough apart
      const dist = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
      if (dist < 30) return;

      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;
      const costText = `${link.cost} km`;

      ctx.font = 'bold 11px Arial';
      const tw = ctx.measureText(costText).width;
      const bpad = 5;

      // Badge background
      ctx.fillStyle = isHighlighted
        ? 'rgba(245,158,11,0.95)'
        : 'rgba(20,20,40,0.92)';
      ctx.strokeStyle = isHighlighted
        ? 'rgba(245,158,11,0.5)'
        : 'rgba(80,80,120,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(mx - tw / 2 - bpad, my - 9, tw + bpad * 2, 18, 4);
      } else {
        ctx.rect(mx - tw / 2 - bpad, my - 9, tw + bpad * 2, 18);
      }
      ctx.fill();
      ctx.stroke();

      // Badge text
      ctx.fillStyle = isHighlighted ? '#000' : '#9090c0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(costText, mx, my);
    },
    [highlightSet]
  );

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      setTimeout(() => {
        fgRef.current?.zoomToFit(600, 100);
      }, 800);
    }
  }, [graphData]);

  if (cities.length === 0) {
    return (
      <div className="empty-graph">
        <div className="empty-icon">🗺️</div>
        <div className="empty-title">No cities added yet</div>
        <div className="empty-sub">
          Add cities and connections from the sidebar,
          then click <strong>Run Floyd-Warshall</strong>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
        linkCanvasObject={linkCanvasObject}
        linkCanvasObjectMode={() => 'replace'}
        backgroundColor="#0d0d18"
        enableZoomInteraction={true}
        enablePanInteraction={true}
        linkDirectionalParticles={highlightPath?.length > 0 ? 5 : 0}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleColor={() => '#00e5ff'}
        linkDirectionalParticleSpeed={0.005}
        cooldownTicks={200}
        d3AlphaDecay={0.015}
        d3VelocityDecay={0.25}
        width={undefined}
        height={undefined}
      />
    </div>
  );
};

export default GraphCanvas;
