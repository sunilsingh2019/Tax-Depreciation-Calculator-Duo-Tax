from app.schemas.calculator import DepreciationRequest, DepreciationResponse, DepreciationYearDetail, AssetCategory
import datetime

def calculate_depreciation(request: DepreciationRequest) -> DepreciationResponse:
    """
    Calculate tax depreciation based on property information.
    """
    # Constants
    CAPITAL_WORKS_RATE = 0.025  # 2.5% per year
    years_to_calculate = 40  # Calculate for 40 years max
    
    # Initialize results
    yearly_breakdown = []
    total_depreciable_amount = request.purchase_price * 0.8  # Assuming 80% of purchase price is depreciable
    
    # Capital works component (building structure)
    # In Australia, residential properties built after September 1985 can claim 2.5% depreciation
    capital_works_deduction = 0
    building_value = request.purchase_price * 0.7  # Assuming 70% of property value is the building
    
    # Check if property was built after 1985
    if request.construction_date >= datetime.date(1985, 9, 15):
        capital_works_deduction = building_value * CAPITAL_WORKS_RATE
    
    # Plant and equipment assets (fixtures and fittings)
    plant_equipment_assets = [asset for asset in request.assets if asset.category == AssetCategory.PLANT_EQUIPMENT]
    
    # Calculate yearly depreciation for each year
    for year in range(1, years_to_calculate + 1):
        # Calculate plant and equipment depreciation
        diminishing_value = 0
        prime_cost = 0
        
        for asset in plant_equipment_assets:
            # Skip assets with no effective life
            if not asset.effective_life:
                continue
                
            # Diminishing value method - 200% / effective life
            dv_rate = 2.0 / asset.effective_life
            if year == 1:
                diminishing_value += asset.value * dv_rate
            else:
                # Apply rate to remaining value (simplified)
                remaining_value = asset.value * max(0, (1 - dv_rate) ** (year - 1))
                diminishing_value += remaining_value * dv_rate
                
            # Prime cost method - 100% / effective life
            pc_rate = 1.0 / asset.effective_life
            prime_cost += asset.value * pc_rate
            
        # Total for the year
        year_total = max(diminishing_value, prime_cost) + capital_works_deduction
        
        yearly_breakdown.append(DepreciationYearDetail(
            year=year,
            diminishing_value=round(diminishing_value, 2),
            prime_cost=round(prime_cost, 2),
            capital_works=round(capital_works_deduction, 2),
            total=round(year_total, 2)
        ))
    
    # Calculate first year and five-year totals
    first_year_depreciation = yearly_breakdown[0].total if yearly_breakdown else 0
    five_year_depreciation = sum(detail.total for detail in yearly_breakdown[:5]) if yearly_breakdown else 0
    
    return DepreciationResponse(
        property_type=request.property_type,
        purchase_price=request.purchase_price,
        total_depreciable_amount=round(total_depreciable_amount, 2),
        yearly_breakdown=yearly_breakdown,
        first_year_depreciation=round(first_year_depreciation, 2),
        five_year_depreciation=round(five_year_depreciation, 2)
    ) 