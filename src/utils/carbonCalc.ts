import { Category } from '../types';

export interface DropdownOption {
  id: string;
  label: string;
  unit: string;
  factor: number; // kg CO2 per unit
}

export const CARBON_FACTORS: Record<Category, DropdownOption[]> = {
  transportation: [
    { id: 'car_gas', label: 'Gasoline Car Voyage', unit: 'km', factor: 0.21 },
    { id: 'car_diesel', label: 'Diesel Car Voyage', unit: 'km', factor: 0.18 },
    { id: 'car_electric', label: 'Electric Car Voyage', unit: 'km', factor: 0.05 },
    { id: 'bus_transit', label: 'Public Bus Transit', unit: 'km', factor: 0.06 },
    { id: 'train_transit', label: 'Train/Metro Voyage', unit: 'km', factor: 0.04 },
    { id: 'flight_short', label: 'Short Flight (< 3 hours)', unit: 'km', factor: 0.24 },
    { id: 'flight_long', label: 'Long Flight (>= 3 hours)', unit: 'km', factor: 0.12 },
    { id: 'walk_bike', label: 'Walking or Cycling', unit: 'km', factor: 0.00 },
  ],
  energy: [
    { id: 'grid_electricity', label: 'Grid Electricity Usage', unit: 'kWh', factor: 0.42 },
    { id: 'heating_gas', label: 'Natural Gas Heating', unit: 'kWh', factor: 0.20 },
    { id: 'heating_oil', label: 'Heating Oil Usage', unit: 'liters', factor: 2.68 },
    { id: 'solar_renewable', label: 'Solar Output / Renewables Offset', unit: 'kWh', factor: -0.42 }, // subtraction factor
  ],
  food: [
    { id: 'meat_heavy', label: 'High-Emissions Diet (Daily/Heavy beef-eating)', unit: 'days', factor: 7.20 },
    { id: 'meat_average', label: 'Average Diet (Mix of poultry/meat)', unit: 'days', factor: 3.80 },
    { id: 'vegetarian', label: 'Vegetarian Diet', unit: 'days', factor: 1.20 },
    { id: 'vegan', label: 'Vegan / Plant-Based Diet', unit: 'days', factor: 0.55 },
    { id: 'food_waste', label: 'Wasted Food Disposal', unit: 'kg', factor: 2.10 },
  ],
  waste: [
    { id: 'landfill_trash', label: 'Sent to Landfill Trash', unit: 'small bags', factor: 0.60 },
    { id: 'recycled_waste', label: 'Recycled Paper/Plastic/Glass', unit: 'small bags', factor: -0.15 }, // subtraction/saving
    { id: 'composted_organic', label: 'Composted Food/Yard Waste', unit: 'kg', factor: -0.10 }, // subtraction/saving
  ],
};

export function calculateEmissions(category: Category, typeId: string, value: number): { emissions: number; unit: string; label: string } {
  const options = CARBON_FACTORS[category];
  const choice = options.find((opt) => opt.id === typeId) || options[0];
  const emissions = choice.factor * Math.max(0, value);
  return {
    emissions: Number(emissions.toFixed(2)),
    unit: choice.unit,
    label: choice.label,
  };
}
