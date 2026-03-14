from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from db import db_store
import time
import random

app = FastAPI(title="Sentinel Agent API", description="Backend for SRE Co-worker UI")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For prototype only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    session_id: str | None = None

class AgentResponse(BaseModel):
    response: str
    action_type: str | None = None
    data: Any | None = None

@app.post("/api/chat", response_model=AgentResponse)
async def chat_endpoint(msg: ChatMessage):
    user_query = msg.message.lower()
    sid = msg.session_id
    
    # Log user message to TinyDB
    db_store.log_chat(sender="user", text=msg.message, session_id=sid)

    # Simulate processing delay
    time.sleep(1.0)

    # Process the query
    result = _process_query(user_query)

    # Log agent response to TinyDB
    db_store.log_chat(sender="agent", text=result.response, session_id=sid, action_type=result.action_type)

    return result


def _process_query(user_query: str) -> AgentResponse:

    # JWT Token Issue
    if "jwt" in user_query or "token" in user_query:
        workflow_data = {
            "incident_id": "INC-3201-JWT",
            "phases": {
                "detection": {
                    "source": "API Gateway Logs / CloudWatch",
                    "issue_type": "Application Issue",
                    "details": "401 Unauthorized errors spiking on /api/v2/orders. JWT token validation failing for 35% of requests.",
                    "infra_health": "Healthy (All pods running, network latency normal)"
                },
                "reasoning": {
                    "docs_analyzed": ["Confluence: Auth Service Architecture", "GitHub: auth-service recent commits", "Vault: JWT signing key rotation schedule"],
                    "root_cause_analysis": "JWT signing key was rotated at 08:00 AM but Auth-Service pod cache still holds the old public key. The key refresh interval is set to 24h instead of 5m.",
                    "confidence": "96%"
                },
                "remediation": {
                    "suggestion": "Force-refresh JWT public key cache on Auth-Service pods and update refresh interval config.",
                    "workflow": [
                        "1. kubectl exec — Flush in-memory JWT key cache on auth-service pods",
                        "2. Update ConfigMap: JWT_KEY_REFRESH_INTERVAL from 24h to 5m",
                        "3. Rolling restart of auth-service deployment",
                        "4. Verify 401 error rate drops below 0.1% within 3 minutes"
                    ]
                }
            }
        }
        return AgentResponse(
            response="I detected a JWT token validation failure impacting 35% of API requests. I've traced the root cause to a stale signing key cache. Let me walk you through the Detection, Reasoning, and Remediation steps.",
            action_type="show_next_gen_workflow",
            data=[workflow_data]
        )

    # API Connectivity Issue
    elif "api" in user_query or "connectivity" in user_query or "gateway" in user_query:
        workflow_data = {
            "incident_id": "INC-3302-API",
            "phases": {
                "detection": {
                    "source": "Istio Service Mesh / Grafana",
                    "issue_type": "Infrastructure + Application",
                    "details": "Upstream connection timeout from API Gateway to Payment-Service. 503 errors at 12 req/s.",
                    "infra_health": "Degraded — Payment-Service pod memory at 95%, connection pool saturated"
                },
                "reasoning": {
                    "docs_analyzed": ["Confluence: API Gateway Routing Config", "GitHub: payment-service Dockerfile", "Grafana: Connection Pool Dashboard"],
                    "root_cause_analysis": "Payment-Service connection pool max is set to 50 (default). Under current load (200 req/s) connections are exhausting. Additionally, a health check misconfiguration is marking healthy pods as unhealthy.",
                    "confidence": "92%"
                },
                "remediation": {
                    "suggestion": "Increase connection pool size to 200 and fix health check endpoint path.",
                    "workflow": [
                        "1. Patch Payment-Service ConfigMap: MAX_POOL_SIZE=200",
                        "2. Fix liveness probe path from /health to /api/health",
                        "3. Apply rolling update to payment-service deployment",
                        "4. Monitor Istio dashboard for 503 rate recovery"
                    ]
                }
            }
        }
        return AgentResponse(
            response="I identified an API connectivity failure between the Gateway and Payment-Service. The connection pool is saturated and health checks are misconfigured. Here is the full triage.",
            action_type="show_next_gen_workflow",
            data=[workflow_data]
        )

    elif "alert" in user_query or "critical" in user_query:
        alerts = db_store.get_all(doc_type="alert")
        return AgentResponse(
            response="Here are the currently active alerts in the system:",
            action_type="show_alerts",
            data=alerts
        )
    elif "metric" in user_query or "latency" in user_query or "cpu" in user_query:
        metrics = db_store.get_all(doc_type="metric")
        return AgentResponse(
            response="I've pulled the latest metrics for you.",
            action_type="show_metrics",
            data=metrics
        )
    # Autonomous 3-Layer Workflow Response
    elif "simulate autonomous" in user_query or "autonomous" in user_query:
        workflow_data = {
            "incident_id": "INC-8192-AUTO",
            "layers": {
                "detection": {
                    "title": "The Senses (Unified Telemetry)",
                    "telemetry_source": "OpenTelemetry Data Lakehouse",
                    "detection_type": "ML Anomaly Whisperer",
                    "issue_identified": "Linear memory leak in Payment-Gateway pod leading to OOMKill.",
                    "noise_reduction": "Reduced 274 raw CPU/Mem alerts into 1 unified context.",
                    "status": "Detected"
                },
                "reasoning": {
                    "title": "The Brain (Multi-Agent Workflow)",
                    "agents": [
                        {
                            "name": "The Diagnostician",
                            "action": "Correlated memory spike with a Redis connection open-handle bug introduced in PR #910.",
                            "confidence": "98%"
                        },
                        {
                            "name": "The Architect",
                            "action": "Generated Terraform/kubectl update to revert PR #910 and temporarily scale pod memory limit to 2Gi.",
                            "confidence": "95%"
                        },
                        {
                            "name": "The Scribe",
                            "action": "Drafted formal post-mortem report and pushed initial draft to Confluence.",
                            "confidence": "100%"
                        }
                    ],
                    "status": "Analyzed"
                },
                "remediation": {
                    "title": "The Hands (Remediation & Closure)",
                    "human_in_loop": {
                        "prompt": "Approve Argocd Rollback & Resource Update?",
                        "platform": "Slack Integration",
                        "status": "Pending Human Approval"
                    },
                    "closed_loop_verification": "AI will monitor memory allocation for 15 mins post-deploy. Will rollback if slope > 0.05MB/s.",
                    "estimated_time_saved": "Investigation reduced from 3 hours to 12 seconds (75%+ Faster Resolution)."
                }
            }
        }
        return AgentResponse(
            response="I noticed a complex memory anomaly creeping up. Don't worry, I've had our Multi-Agent Autonomous Engine process the telemetry and triage the root cause. I've already prepared an automated remediation plan. Just give me the green light (approval) and I'll execute the fix for us.",
            action_type="show_autonomous_workflow",
            data=[workflow_data]
        )

    # Next-Gen SRE Interactive Workflow Response (Previous logic)
    elif "simulate next gen" in user_query or "next gen" in user_query or "workflow" in user_query:
        workflow_data = {
            "incident_id": "INC-2099",
            "phases": {
                "detection": {
                    "source": "Datadog / PagerDuty",
                    "issue_type": "Application Issue",
                    "details": "500 Internal Server Error spike originating from Checkout-Service.",
                    "infra_health": "Healthy (CPU/Memory normal on all nodes)"
                },
                "reasoning": {
                    "docs_analyzed": ["Confluence: Checkout Architecture", "GitHub: Recent Commits"],
                    "root_cause_analysis": "Found a suspect PR merged 12 minutes ago (#4910: Payment Gateway Timeout adjustment). The new timeout (50ms) is too aggressive for legacy cards.",
                    "confidence": "94%"
                },
                "remediation": {
                    "suggestion": "Rollback PR #4910 and temporarily revert payment timeout to 500ms.",
                    "workflow": [
                        "1. Isolate traffic from Checkout-Service-v1.4",
                        "2. Trigger automated rollback pipeline to v1.3",
                        "3. Verify error rate drops below 1%"
                    ]
                }
            }
        }
        return AgentResponse(
            response="Hey! I've been monitoring the telemetry and saw an anomaly spike. I've already mapped out the root cause for us. Let's walk through the Detection, Reasoning, and Remediation phases together. I'm right beside you.",
            action_type="show_next_gen_workflow",
            data=[workflow_data]
        )

    elif "knowledge" in user_query or "rectify" in user_query or "timeline" in user_query or "past" in user_query or "learning" in user_query:
        kb_entries = db_store.get_all(doc_type="knowledge_base")
        return AgentResponse(
            response="I pulled up the incident time map for you. Here are the past experiences and manual overrides recorded by our fellow SREs. This collective knowledge helps us resolve things faster!",
            action_type="show_knowledge_base",
            data=kb_entries
        )
    elif "search" in user_query or "find" in user_query:
        term = user_query.replace("search", "").replace("for", "").strip()
        results = db_store.search(term)
        return AgentResponse(
            response=f"Found {len(results)} results in the datastore for '{term}'.",
            action_type="show_search_results",
            data=results
        )

    elif "plan" in user_query or "day" in user_query or "schedule" in user_query or "activit" in user_query:
        daily_plan = {
            "critical_alerts": 2,
            "tasks": [
                "⚠️ [P0] Investigate JWT Token Expiry — 401 errors on /api/v2/orders",
                "⚠️ [P0] Triage API Gateway → Payment-Service connectivity (503s)",
                "🔧 [P1] Approve pending ArgoCD rollback PR #4911",
                "📉 [P2] Scale down staging environment resources (FinOps)",
                "📝 [P2] Update runbook for Database Connection Pool Exhaustion",
                "🔍 [P3] Review Knowledge Base entries from last week's incidents"
            ],
            "upcoming_meetings": [
                "10:00 AM — Incident Review Sync (JWT + API issues)",
                "11:30 AM — Change Advisory Board (PR #4911 approval)",
                "1:30 PM — SRE Weekly Standup",
                "3:00 PM — FinOps Optimization Review"
            ]
        }
        return AgentResponse(
            response="Good morning! I've analyzed our systems and prepared your detailed daily SRE action plan. We have 2 critical P0 incidents to triage before your 10:00 AM sync. Here's your full schedule.",
            action_type="show_daily_plan",
            data=[daily_plan]
        )

    elif "issue" in user_query or "active" in user_query:
        alerts = db_store.get_all(doc_type="alert")
        return AgentResponse(
            response="Here are the current active issues and critical alerts pulled from the system telemetry.",
            action_type="show_issues",
            data=alerts
        )

    elif "flow" in user_query or "available" in user_query:
        flows = [
            {"name": "Database Pool Exhaustion Rollback", "description": "Auto-scales DB read-replicas and cleans stale sessions.", "status": "Ready"},
            {"name": "Payment Gateway Timeout Fix", "description": "Reverts recent config changes to payment service via ArgoCD.", "status": "Ready"},
            {"name": "OOM Pod Eviction Handling", "description": "Dynamically shifts user traffic to secondary cluster while scaling up memory.", "status": "Ready"}
        ]
        return AgentResponse(
            response="I have several automated Gen-AI SRE flows ready for deployment. Here are the most relevant ones based on our architecture.",
            action_type="show_flows",
            data=flows
        )

    elif "recommendation" in user_query or "remediate" in user_query or "suggestion" in user_query:
        recommendation = {
            "incident": "High CPU Usage in Production Database",
            "confidence": "98%",
            "steps": [
                "1. Temporarily pause analytical queries on primary DB node.",
                "2. Trigger auto-scale event to add 2 read-replicas immediately.",
                "3. Apply aggressive connection timeout (500ms) to prevent queuing.",
                "4. Monitor p99 latency for 5 minutes (Closed-Loop Verification)."
            ],
            "estimated_time_saved": "45m",
            "associated_flow": "Database Pool Exhaustion Rollback"
        }
        return AgentResponse(
            response="Based on the active Database CPU issue, I have generated a step-by-step remediation recommendation. I can execute the associated flow whenever you are ready.",
            action_type="show_recommendation",
            data=[recommendation]
        )
    
    # Generic response
    responses = [
        "I'm monitoring the systems. Everything looks nominal right now.",
        "Could you clarify what you need me to check? You can use the prompt chips above.",
        "I can help you search the logs, view current alerts, or check past incident knowledge base timelines."
    ]
    return AgentResponse(
        response=random.choice(responses),
        action_type="text_only"
    )

# Helper: wrap response and log agent reply
def _build_and_log(response: str, action_type: str, data: Any = None):
    db_store.log_chat(sender="agent", text=response, action_type=action_type)
    return AgentResponse(response=response, action_type=action_type, data=data)

# --- Session Management APIs ---

@app.post("/api/sessions")
async def create_session():
    """Create a new chat session."""
    sid = db_store.create_session(title="New Chat")
    return {"session_id": sid}

@app.get("/api/sessions")
async def list_sessions():
    """List all chat sessions."""
    return db_store.get_sessions()

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and all its messages."""
    db_store.delete_session(session_id)
    return {"status": "deleted", "session_id": session_id}

@app.get("/api/sessions/{session_id}/messages")
async def get_session_messages(session_id: str):
    """Get all messages for a specific session."""
    return db_store.get_session_messages(session_id)

@app.get("/api/chat/history")
async def get_chat_history():
    """Return all persisted chat messages from TinyDB."""
    return db_store.get_chat_history()

@app.get("/api/dashboard/summary")
async def get_dashboard_summary():
    """Provides initial data for the SRE dashboard."""
    alerts = db_store.get_all(doc_type="alert")
    metrics = db_store.get_all(doc_type="metric")
    return {
        "active_alerts_count": len(alerts),
        "system_status": "Degraded" if any(a.get("severity") == "critical" for a in alerts) else "Healthy",
        "recent_metrics": metrics,
        "time_saved_metric": "50% Reduction via AI Assist"
    }
