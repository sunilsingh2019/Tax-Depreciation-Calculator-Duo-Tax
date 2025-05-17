export enum PropertyType {
  RESIDENTIAL = "residential",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial"
}

export enum AssetCategory {
  CAPITAL_WORKS = "capital_works",
  PLANT_EQUIPMENT = "plant_equipment"
}

export interface AssetItem {
  name: string;
  category: AssetCategory;
  value: number;
  effective_life?: number;
}

export interface DepreciationRequest {
  property_type: PropertyType;
  construction_date: Date;
  purchase_date: Date;
  purchase_price: number;
  is_new_property: boolean;
  assets: AssetItem[];
}

export interface DepreciationYearDetail {
  year: number;
  diminishing_value: number;
  prime_cost: number;
  capital_works: number;
  total: number;
}

export interface DepreciationResponse {
  property_type: PropertyType;
  purchase_price: number;
  total_depreciable_amount: number;
  yearly_breakdown: DepreciationYearDetail[];
  first_year_depreciation: number;
  five_year_depreciation: number;
} 