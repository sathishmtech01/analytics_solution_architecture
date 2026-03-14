import uuid
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from tinydb import TinyDB, Query

SEED_FILE = os.path.join(os.path.dirname(__file__), "seed_data.json")

class MockElasticStore:
    def __init__(self, db_path='history.json'):
        self.db = TinyDB(db_path)
        if len(self.db.all()) == 0:
            self._seed_from_file()

    def _seed_from_file(self):
        """Load seed data from external seed_data.json file."""
        if not os.path.exists(SEED_FILE):
            return
        with open(SEED_FILE, "r") as f:
            seed = json.load(f)

        now = datetime.now()

        # Alerts
        for a in seed.get("alerts", []):
            self.index_document({
                "type": "alert",
                "title": a["title"],
                "severity": a["severity"],
                "description": a["description"],
                "timestamp": (now + timedelta(minutes=a.get("offset_minutes", 0))).isoformat()
            })

        # Metrics
        for m in seed.get("metrics", []):
            self.index_document({
                "type": "metric",
                "name": m["name"],
                "value": m["value"],
                "unit": m["unit"],
                "timestamp": now.isoformat()
            })

        # Knowledge Base
        for kb in seed.get("knowledge_base", []):
            self.index_document({
                "type": "knowledge_base",
                "incident_id": kb["incident_id"],
                "sre_experience": kb["sre_experience"],
                "solution_applied": kb["solution_applied"],
                "timestamp": (now + timedelta(days=kb.get("offset_days", 0))).isoformat()
            })

        # Past Sessions
        for session in seed.get("past_sessions", []):
            sid = self.create_session(title=session["title"])
            ts = now + timedelta(hours=session.get("offset_hours", 0))
            for i, msg in enumerate(session.get("messages", [])):
                self.log_chat(
                    sender=msg["sender"], text=msg["text"],
                    session_id=sid, action_type=msg.get("action_type"),
                    ts_override=ts + timedelta(minutes=i)
                )

    def index_document(self, doc: Dict[str, Any]) -> str:
        doc_id = str(uuid.uuid4())
        doc["_id"] = doc_id
        self.db.insert(doc)
        return doc_id

    # --- Session Management ---
    def create_session(self, title: str = "New Chat") -> str:
        session_id = str(uuid.uuid4())[:8]
        self.index_document({
            "type": "chat_session",
            "session_id": session_id,
            "title": title,
            "created_at": datetime.now().isoformat()
        })
        return session_id

    def get_sessions(self) -> List[Dict[str, Any]]:
        Q = Query()
        sessions = self.db.search(Q.type == "chat_session")
        return sorted(sessions, key=lambda x: x.get("created_at", ""), reverse=True)

    def delete_session(self, session_id: str):
        Q = Query()
        self.db.remove((Q.type == "chat_session") & (Q.session_id == session_id))
        self.db.remove((Q.type == "chat_history") & (Q.session_id == session_id))

    def log_chat(self, sender: str, text: str, session_id: str = None, action_type: str = None, ts_override=None):
        doc = {
            "type": "chat_history",
            "sender": sender,
            "text": text,
            "session_id": session_id,
            "timestamp": (ts_override or datetime.now()).isoformat()
        }
        if action_type:
            doc["action_type"] = action_type
        self.index_document(doc)

    def get_session_messages(self, session_id: str) -> List[Dict[str, Any]]:
        Q = Query()
        entries = self.db.search((Q.type == "chat_history") & (Q.session_id == session_id))
        return sorted(entries, key=lambda x: x.get("timestamp", ""))

    def get_chat_history(self) -> List[Dict[str, Any]]:
        Q = Query()
        entries = self.db.search(Q.type == "chat_history")
        return sorted(entries, key=lambda x: x.get("timestamp", ""))

    def search(self, query_text: str) -> List[Dict[str, Any]]:
        query_text = query_text.lower()
        return [doc for doc in self.db.all() if query_text in str(doc).lower()]

    def get_all(self, doc_type: Optional[str] = None) -> List[Dict[str, Any]]:
        if not doc_type:
            return self.db.all()
        Q = Query()
        return self.db.search(Q.type == doc_type)

db_store = MockElasticStore()
