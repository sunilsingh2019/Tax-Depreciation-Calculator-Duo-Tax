from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import date

class PropertyType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"

class AssetCategory(str, Enum):
    CAPITAL_WORKS = "capital_works"
    PLANT_EQUIPMENT = "plant_equipment"

class AssetItem(BaseModel):
    name: str
    category: AssetCategory
    value: float
    effective_life: Optional[int] = None

class DepreciationRequest(BaseModel):
    property_type: PropertyType
    construction_date: date
    purchase_date: date
    purchase_price: float
    is_new_property: bool
    assets: List[AssetItem] = Field(default_factory=list)

class DepreciationYearDetail(BaseModel):
    year: int
    diminishing_value: float
    prime_cost: float
    capital_works: float
    total: float

class DepreciationResponse(BaseModel):
    property_type: PropertyType
    purchase_price: float
    total_depreciable_amount: float
    yearly_breakdown: List[DepreciationYearDetail]
    first_year_depreciation: float
    five_year_depreciation: float 