import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { CreditCardForm } from "@/components/components/credit-card-form";
// Add other special component imports here as you find them
// e.g. import { LocationInput } from "@/components/ui/location-input";

export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
  // Standard Inputs
  input: Input,
  textarea: Textarea,
  checkbox: Checkbox,
  "radio-group": RadioGroup,
  select: Select,

  // Special Compound Components
  "credit-card": CreditCardForm,
  // "location": LocationInput,
  // Add more mappings here
  
  // Add fallback for types that are essentially a text input
  email: Input,
  phone: Input,
  date: Input,
  number: Input,
};

export function getFormComponent(type: string) {
  return ComponentRegistry[type] || Input; // Default to a standard Input if type is not found
} 