# app/services/memory.py

_memory = {}

def get_memory(session_id: str):
    if session_id not in _memory:
        _memory[session_id] = []
    return _memory[session_id]
