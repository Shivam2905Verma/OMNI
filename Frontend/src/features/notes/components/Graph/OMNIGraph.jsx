import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../../style/graph.scss";

function cosine(a, b) {
  let dot = 0,
    ma = 0,
    mb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    ma += a[i] * a[i];
    mb += b[i] * b[i];
  }
  const denom = Math.sqrt(ma) * Math.sqrt(mb);
  return denom === 0 ? 0 : dot / denom;
}

const NODE_COLOR = "#7F77DD";

const OMNIGraph = ({noteData}) => {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [threshold, setThreshold] = useState(0.7);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  useEffect(() => {
    if (!noteData || noteData.length === 0) return;

    const notes = noteData.filter((n) => n.embedding && n.embedding.length > 0);
    if (notes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const W = svgRef.current.clientWidth || 700;
    const H = svgRef.current.clientHeight || 500;

    const links = [];
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const sim = cosine(notes[i].embedding, notes[j].embedding);
        if (sim >= threshold) {
          links.push({ source: notes[i]._id, target: notes[j]._id, sim });
        }
      }
    }

    setStats({ nodes: notes.length, edges: links.length });

    const connCount = {};
    notes.forEach((n) => (connCount[n._id] = 0));
    links.forEach((l) => {
      connCount[l.source]++;
      connCount[l.target]++;
    });

    const g = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.2, 5])
        .touchable(true)
        .on("zoom", (e) => g.attr("transform", e.transform)),
    );

    const linkSel = g
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", NODE_COLOR)
      .attr("stroke-opacity", (d) =>
        Math.min(0.15 + (d.sim - threshold) * 3, 0.7),
      )
      .attr("stroke-width", (d) => 0.5 + (d.sim - threshold) * 10);

    const svgEl = svgRef.current;
    const getTransform = () => {
      const t = d3.zoomTransform(svgEl);
      return t;
    };

    const dragBehavior = d3
      .drag()
      .on("start", (e, d) => {
        if (!e.active) simRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on("end", (e, d) => {
        if (!e.active) simRef.current.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeG = g
      .append("g")
      .selectAll("g")
      .data(notes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .on("click", (e, d) => {
        setSelected(d);
        e.stopPropagation();
      })
      .call(dragBehavior)
      .each(function (d) {
        const el = this;

        let touchStartX = 0;
        let touchStartY = 0;
        let isTapCandidate = false;

        el.addEventListener(
          "touchstart",
          (e) => {
            e.stopPropagation();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isTapCandidate = true;

            if (!simRef.current) return;
            simRef.current.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          },
          { passive: true },
        );

        el.addEventListener(
          "touchmove",
          (e) => {
            e.stopPropagation();
            isTapCandidate = false;
            const touch = e.touches[0];
            const svgRect = svgEl.getBoundingClientRect();
            const t = getTransform();

            d.fx = (touch.clientX - svgRect.left - t.x) / t.k;
            d.fy = (touch.clientY - svgRect.top - t.y) / t.k;
          },
          { passive: true },
        );

        el.addEventListener(
          "touchend",
          (e) => {
            e.stopPropagation();
            if (!simRef.current) return;
            simRef.current.alphaTarget(0);
            d.fx = null;
            d.fy = null;

            if (isTapCandidate) {
              const touch = e.changedTouches[0];
              const dx = touch.clientX - touchStartX;
              const dy = touch.clientY - touchStartY;
              if (Math.sqrt(dx * dx + dy * dy) < 8) {
                setSelected(d);
              }
            }
            isTapCandidate = false;
          },
          { passive: true },
        );
      });

    nodeG
      .append("circle")
      .attr("r", (d) => 12 + (connCount[d._id] || 0) * 2)
      .attr("fill", NODE_COLOR + "20")
      .attr("stroke", NODE_COLOR)
      .attr("stroke-width", 1.5);

    nodeG
      .append("text")
      .text((d) => {
        const s = d.subtopic || "";
        return s.length > 12 ? s.slice(0, 11) + "…" : s;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#333")
      .attr("pointer-events", "none");

    if (simRef.current) simRef.current.stop();

    simRef.current = d3
      .forceSimulation(notes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d._id)
          .distance((d) => 160 - d.sim * 80)
          .strength((d) => d.sim * 0.8),
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => 18 + (connCount[d._id] || 0) * 2),
      )
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

    svg.on("click", () => setSelected(null));

    return () => simRef.current?.stop();
  }, [noteData, threshold]);

  const related = selected
    ? noteData
        .filter((n) => n._id !== selected._id && n.embedding?.length > 0)
        .map((n) => ({ ...n, sim: cosine(selected.embedding, n.embedding) }))
        .filter((n) => n.sim >= threshold)
        .sort((a, b) => b.sim - a.sim)
        .slice(0, 6)
    : [];

  const shortSummary = (text, len = 160) =>
    text && text.length > len ? text.slice(0, len) + "…" : text || "";

  return (
    <div className="omni-graph">
      <div className="omni-graph__main">
        {/* toolbar */}
        <div className="omni-graph__toolbar">
          <span className="omni-graph__toolbar-label">Similarity</span>
          <input
            type="range"
            min={50}
            max={98}
            step={1}
            value={Math.round(threshold * 100)}
            onChange={(e) => setThreshold(Number(e.target.value) / 100)}
            className="omni-graph__toolbar-slider"
          />
          <span className="omni-graph__toolbar-value">
            {Math.round(threshold * 100)}%
          </span>
          <span className="omni-graph__toolbar-stats">
            {stats.nodes} notes · {stats.edges} connections
          </span>
        </div>

        {/* graph canvas */}
        <div className="omni-graph__canvas">
          {(!noteData || noteData.length === 0) && (
            <div className="omni-graph__empty">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="10" cy="20" r="5" stroke="#ccc" strokeWidth="1.5" />
                <circle cx="30" cy="10" r="5" stroke="#ccc" strokeWidth="1.5" />
                <circle cx="30" cy="30" r="5" stroke="#ccc" strokeWidth="1.5" />
                <line
                  x1="15"
                  y1="20"
                  x2="25"
                  y2="12"
                  stroke="#ddd"
                  strokeWidth="1"
                />
                <line
                  x1="15"
                  y1="20"
                  x2="25"
                  y2="28"
                  stroke="#ddd"
                  strokeWidth="1"
                />
              </svg>
              <span className="omni-graph__empty-text">
                No notes to display
              </span>
            </div>
          )}
          <svg ref={svgRef} />
        </div>
      </div>

      {/* panel — sidebar on desktop, bottom sheet on mobile */}
      {selected && (
        <div className="omni-graph__panel">
          <div className="omni-graph__panel-header">
            <div className="omni-graph__panel-top">
              <span className="omni-graph__panel-subtopic">
                {selected.subtopic || "Note"}
              </span>
              <button
                className="omni-graph__panel-close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            {selected.tags?.length > 0 && (
              <div className="omni-graph__panel-tags">
                {selected.tags.map((tag, i) => (
                  <span key={i} className="omni-graph__panel-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="omni-graph__panel-summary">
              {shortSummary(selected.summary)}
            </p>

            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noreferrer"
                className="omni-graph__panel-link"
              >
                Open source →
              </a>
            )}
          </div>

          <div className="omni-graph__panel-body">
            {related.length > 0 ? (
              <>
                <p className="omni-graph__panel-related-title">Related notes</p>
                {related.map((n) => (
                  <div
                    key={n._id}
                    className="omni-graph__related-card"
                    onClick={() => setSelected(n)}
                  >
                    <div className="omni-graph__related-card-top">
                      <span className="omni-graph__related-card-subtopic">
                        {n.subtopic || "Note"}
                      </span>
                      <span className="omni-graph__related-card-sim">
                        {Math.round(n.sim * 100)}%
                      </span>
                    </div>
                    <p className="omni-graph__related-card-summary">
                      {n.summary}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p className="omni-graph__panel-empty-msg">
                No related notes at {Math.round(threshold * 100)}% threshold.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OMNIGraph;
