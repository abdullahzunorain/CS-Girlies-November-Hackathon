import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import CharacterBackground from "./CharacterBackground";
import XPNotification from "./XPNotification";
import { calculateXPWithBonus, awardXP } from "../../services/api";
import "./MindMappingSession.css";

const MindMappingSession = ({ flashcards, onSessionComplete }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sessionXP, setSessionXP] = useState(0);
  const [viewedCards, setViewedCards] = useState(new Set());
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [showBonusText, setShowBonusText] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!flashcards || flashcards.length === 0) return;

    // Create initial nodes in a radial/circular layout
    const centerX = 400;
    const centerY = 300;
    const radius = 250;

    const initialNodes = flashcards.map((card, index) => {
      const angle = (index / flashcards.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: `${index}`,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div className="node-content">
              <div className="node-number">{index + 1}</div>
              <div className="node-question">{card.question}</div>
            </div>
          ),
          card: card,
          index: index,
        },
        style: {
          background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "15px",
          padding: "15px",
          width: 200,
          fontSize: "12px",
          cursor: "pointer",
        },
      };
    });

    setNodes(initialNodes);
  }, [flashcards]);

  const onConnect = useCallback(
    (params) => {
      // Award XP for creating connections
      const technique = "mind-mapping";
      const xpResult = calculateXPWithBonus(25, technique);

      setSessionXP((prev) => prev + xpResult.totalXP);
      awardXP("mind_mapping_connection", 25);

      setLastXP(xpResult.totalXP);
      setShowXP(true);

      if (xpResult.hasBonus) {
        setBonusMessage(
          `${xpResult.characterName}'s Specialty! +${xpResult.bonus} bonus XP! 🌟`
        );
        setShowBonusText(true);
        setTimeout(() => setShowBonusText(false), 3000);
      }

      setTimeout(() => setShowXP(false), 2000);

      // Add edge with custom styling
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#f39c12", strokeWidth: 3 },
            type: "smoothstep",
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      const nodeIndex = parseInt(node.id);

      // Award XP for viewing card
      if (!viewedCards.has(nodeIndex)) {
        const technique = "mind-mapping";
        const xpResult = calculateXPWithBonus(15, technique);

        setSessionXP((prev) => prev + xpResult.totalXP);
        setViewedCards(new Set([...viewedCards, nodeIndex]));
        awardXP("mind_mapping_view", 15);

        setLastXP(xpResult.totalXP);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 2000);

        // Update node style to show it's been viewed
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                style: {
                  ...n.style,
                  background:
                    "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                  border: "2px solid #2ecc71",
                },
              };
            }
            return n;
          })
        );
      }

      setSelectedNode(node);
    },
    [viewedCards, setNodes]
  );

  const handleComplete = () => {
    const sessionData = {
      xp: sessionXP + 100,
      completed: viewedCards.size,
      total: flashcards.length,
    };
    onSessionComplete(sessionData);
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <CharacterBackground>
        <div className="mind-mapping-session">
          <div className="loading">No flashcards available</div>
        </div>
      </CharacterBackground>
    );
  }

  return (
    <CharacterBackground>
      <div className="mind-mapping-session">
        <div className="mm-full-container">
          {/* Header */}
          <div className="mm-top-bar">
            <div className="mm-stats-compact">
              <span>🧠 Mind Map</span>
              <span>|</span>
              <span>
                📚 {viewedCards.size}/{flashcards.length} Explored
              </span>
              <span>|</span>
              <span>🔗 {edges.length} Connections</span>
              <span>|</span>
              <span>⭐ {sessionXP} XP</span>
            </div>

            {viewedCards.size >= Math.ceil(flashcards.length * 0.5) && (
              <button className="complete-btn-compact" onClick={handleComplete}>
                Complete Session ✨
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mm-instructions-compact">
            <p>
              💡 <strong>Drag</strong> nodes to organize •{" "}
              <strong>Click</strong> to view details •{" "}
              <strong>Drag from edge</strong> to create connections
            </p>
          </div>

          {/* React Flow Canvas */}
          <div className="reactflow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const index = parseInt(node.id);
                  return viewedCards.has(index) ? "#2ecc71" : "#9b59b6";
                }}
                maskColor="rgba(0, 0, 0, 0.6)"
              />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>

          {/* Selected Node Details Panel */}
          {selectedNode && (
            <div className="node-details-panel">
              <button
                className="close-panel"
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </button>
              <h3>Card #{parseInt(selectedNode.id) + 1}</h3>
              <div className="detail-question">
                <strong>Question:</strong>
                <p>{selectedNode.data.card.question}</p>
              </div>
              <div className="detail-answer">
                <strong>Answer:</strong>
                <p>{selectedNode.data.card.answer}</p>
              </div>
            </div>
          )}

          {/* XP notifications */}
          <XPNotification xp={lastXP} show={showXP} />
          {showBonusText && <div className="bonus-message">{bonusMessage}</div>}
        </div>
      </div>
    </CharacterBackground>
  );
};

export default MindMappingSession;
