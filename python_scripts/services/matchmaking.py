from pydantic import BaseModel

class MatchRequest(BaseModel):

    questionnaire: dict

    cats: list