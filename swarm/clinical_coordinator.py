# SPDX-License-Identifier: MIT
from typing import Dict, Any, List
import concurrent.futures
from specialized_agents import TimelineAgent, MedicationAgent, AllergyAgent, RiskAgent

class ClinicalCoordinator:
    """Coordinates specialized agent execution and aggregates reports into a bundle."""
    def __init__(self):
        self.timeline_agent = TimelineAgent()
        self.medication_agent = MedicationAgent()
        self.allergy_agent = AllergyAgent()
        self.risk_agent = RiskAgent()

    def coordinate_analysis(self, record_text: str) -> Dict[str, str]:
        """Runs all specialized agents in parallel to generate a clinical bundle."""
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_timeline = executor.submit(self.timeline_agent.analyze, record_text)
            future_medication = executor.submit(self.medication_agent.analyze, record_text)
            future_allergy = executor.submit(self.allergy_agent.analyze, record_text)
            future_risk = executor.submit(self.risk_agent.analyze, record_text)

            results = {
                "timeline": future_timeline.result(),
                "medications": future_medication.result(),
                "allergies": future_allergy.result(),
                "risks": future_risk.result()
            }
            
        return results
