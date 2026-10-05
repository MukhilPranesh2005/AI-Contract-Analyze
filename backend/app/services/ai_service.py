import json

from google import genai

from app.config import GEMINI_API_KEY
from app.utils.prompts import ANALYZE_PROMPT, CHAT_PROMPT_WITH_DOC, CHAT_PROMPT_GENERAL

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_contract(document):

    prompt = ANALYZE_PROMPT.format(document=document)

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-3-flash-preview",
        "gemini-3.5-flash",
        "gemini-3.6-flash"
    ]

    response = None
    last_err = None
    import time

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                break
        except Exception as err:
            last_err = err

    if response is None or not response.text:
        if last_err:
            raise last_err
        raise RuntimeError("No response received from Gemini model")

    text = response.text or ""

    text = text.replace("```json", "")
    text = text.replace("```", "").strip()

    try:
        data = json.loads(text)
    except Exception as e:
        # Fallback if markdown or extra text slipped through
        import re
        json_match = re.search(r"\{.*\}", text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
        else:
            raise e

    # Ensure baseline fields exist
    if "summary" not in data:
        data["summary"] = ""
    if "risk" not in data:
        data["risk"] = ""
    if "important_clauses" not in data:
        data["important_clauses"] = data.get("clauses", [])
    if "clauses" not in data:
        data["clauses"] = data["important_clauses"]
    if "recommendations" not in data:
        data["recommendations"] = []

    # Ensure obligations field exists and is well-formed
    if "obligations" not in data or not isinstance(data["obligations"], list):
        data["obligations"] = []

    # Normalize and enrich digital_twin structure
    raw_dt = data.get("digital_twin")
    if not isinstance(raw_dt, dict):
        raw_dt = {}

    dt_items = raw_dt.get("items", [])
    if not isinstance(dt_items, list):
        dt_items = []

    # If digital_twin items were empty but obligations were found, synthesize digital_twin items
    if not dt_items and data["obligations"]:
        for idx, ob in enumerate(data["obligations"], start=1):
            dt_items.append({
                "id": f"DT-{idx:02d}",
                "obligation": ob.get("obligation", ""),
                "responsible_party": ob.get("party", "Not specified"),
                "deadline": ob.get("deadline", "Not specified"),
                "status": "Active",
                "evidence": "Verification record / payment receipt / notice acknowledgement",
                "contractual_consequence": "Standard contractual remedies for breach / default",
                "clause_reference": f"Clause item #{idx}",
                "source_clause_text": ob.get("source_text", ""),
                "category": "Operational & Milestones" if "deadline" in ob else "Financial & Payment",
                "risk_level": "Medium",
                "source_page": ob.get("source_page")
            })

    # If obligations were empty but digital_twin items were found, synthesize obligations
    if not data["obligations"] and dt_items:
        for it in dt_items:
            data["obligations"].append({
                "party": it.get("responsible_party", "Not specified"),
                "obligation": it.get("obligation", ""),
                "deadline": it.get("deadline", "Not specified"),
                "amount": "Not specified",
                "source_text": it.get("source_clause_text", it.get("obligation", "")),
                "source_page": it.get("source_page")
            })

    # Sanitize each digital twin item
    sanitized_items = []
    high_risk_count = 0
    for idx, item in enumerate(dt_items, start=1):
        if not isinstance(item, dict):
            continue
        item_id = item.get("id") or f"DT-{idx:02d}"
        obligation = item.get("obligation", "").strip()
        party = item.get("responsible_party", item.get("party", "Not specified")).strip()
        deadline = item.get("deadline", "Not specified in contract").strip()
        status = item.get("status", "Pending").strip()
        evidence = item.get("evidence", "Standard compliance confirmation / receipt").strip()
        consequence = item.get("contractual_consequence", item.get("consequence", "Contractual breach remedies / Not specified")).strip()
        clause_ref = item.get("clause_reference", item.get("clause", f"Clause {idx}")).strip()
        source_text = item.get("source_clause_text", item.get("source_text", "")).strip()
        category = item.get("category", "General Obligation").strip()
        risk_level = item.get("risk_level", "Medium").strip()
        if risk_level.lower() in ["high", "critical"]:
            high_risk_count += 1

        sanitized_items.append({
            "id": item_id,
            "obligation": obligation,
            "responsible_party": party,
            "deadline": deadline,
            "status": status if status in ["Active", "Pending", "Upcoming", "At Risk", "Completed", "Requires Review"] else "Active",
            "evidence": evidence,
            "contractual_consequence": consequence,
            "clause_reference": clause_ref,
            "source_clause_text": source_text,
            "category": category,
            "risk_level": risk_level,
            "source_page": item.get("source_page")
        })

    # Summary metrics
    metrics = raw_dt.get("summary_metrics", {})
    if not isinstance(metrics, dict):
        metrics = {}

    metrics["total_obligations"] = len(sanitized_items)
    metrics["high_risk_obligations"] = high_risk_count
    metrics["critical_deadlines"] = sum(1 for it in sanitized_items if it.get("deadline") and it.get("deadline").lower() not in ["not specified", "not specified in contract", "none", "n/a"])
    metrics["actionable_items"] = len(sanitized_items)

    parties_list = raw_dt.get("parties", [])
    if not parties_list or not isinstance(parties_list, list):
        # Extract unique parties from sanitized items
        unique_parties = list(dict.fromkeys(it["responsible_party"] for it in sanitized_items if it["responsible_party"] and it["responsible_party"].lower() != "not specified"))
        parties_list = unique_parties if unique_parties else ["Party A", "Party B"]

    data["digital_twin"] = {
        "contract_name": raw_dt.get("contract_name") or "Analyzed Contract Agreement",
        "parties": parties_list,
        "effective_date": raw_dt.get("effective_date") or "As defined in agreement",
        "governing_law": raw_dt.get("governing_law") or "Specified in contract jurisdiction",
        "summary_metrics": metrics,
        "items": sanitized_items
    }

    return data


def extract_digital_twin_only(document: str):
    full_data = analyze_contract(document)
    return full_data.get("digital_twin", {})


def chat_with_contract(question: str, document_text: str = "", history: list = None):
    history = history or []
    history_str = ""
    if history:
        lines = ["Conversation History:"]
        for turn in history:
            role = turn.get("role", "user")
            content = turn.get("content", turn.get("text", ""))
            if role in ["user", "human"]:
                lines.append(f"User: {content}")
            else:
                lines.append(f"Assistant: {content}")
        history_str = "\n".join(lines) + "\n\n"

    if document_text and document_text.strip():
        prompt = CHAT_PROMPT_WITH_DOC.format(
            document=document_text.strip(),
            history_section=history_str,
            question=question
        )
    else:
        prompt = CHAT_PROMPT_GENERAL.format(
            history_section=history_str,
            question=question
        )

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-3-flash-preview",
        "gemini-3.5-flash",
        "gemini-3.6-flash",
        "gemini-3.1-flash-lite"
    ]

    response = None
    last_err = None

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                break
        except Exception as err:
            last_err = err

    if response is None or not response.text:
        if last_err:
            raise last_err
        raise RuntimeError("No response received from Gemini model")

    return response.text.strip()