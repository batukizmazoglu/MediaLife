// Shared FormRenderer for both playground preview and public form rendering
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCardForm } from '@/components/components/credit-card-form';
import { SignatureForm } from '@/components/components/signature-form';
import { LocationForm } from '@/components/components/location-form';
import { AutocompleteForm } from '@/components/components/autocomplete-form';
import Autocomplete from '@/components/ui/autocomplete';
import { getFormComponent } from "@/app/forms/component-registry";

// --- Types ---
type FormElement = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  variant?: string;
  options?: any[];
};

type FormStructure = {
  json: FormElement[];
  name: string;
  id: string;
};

// --- Shared FormRenderer ---
const FormRenderer = ({ formStructure, onSubmit: onSubmitProp }: { formStructure: FormStructure, onSubmit?: (data: any) => void }) => {
  const formSchema = useMemo(() => {
    return z.object(
      (formStructure?.json ?? []).reduce((acc, field) => {
        if (!field.name) return acc;
        let schema: z.ZodTypeAny;
        if (field.type === 'checkbox') {
          schema = z.boolean().default(false);
          if (field.required) {
            schema = schema.refine(val => val === true, {
              message: `${field.label} is required.`,
            });
          }
        } else {
          schema = z.string();
          if (field.required) {
            schema = (schema as z.ZodString).min(1, { message: `${field.label} is required.` });
          } else {
            schema = schema.optional();
          }
        }
        acc[field.name] = schema;
        return acc;
      }, {} as Record<string, z.ZodTypeAny>)
    );
  }, [formStructure]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => (formStructure?.json ?? []).reduce((acc, field) => {
        if (!field.name) return acc;
        acc[field.name] = field.type === 'checkbox' ? false : '';
        return acc;
    }, {} as Record<string, any>), [formStructure]),
  });

  if (!formStructure?.json) return null;

  const onSubmit = onSubmitProp || (() => {});

  const fields = formStructure.json;

  const getFieldKey = (field: FormElement, idx: number) => field.name || idx;
  const getFieldName = (field: FormElement) => field.name;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{formStructure.name}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields
            .filter((field: FormElement) => !!field.name)
            .map((field: FormElement, idx: number) => (
              <FormField
                key={getFieldKey(field, idx)}
                control={form.control}
                name={getFieldName(field) as any}
                render={({ field: controlledField }) => {
                  const ComponentToRender = getFormComponent(field.type);
                  return (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <ComponentToRender {...controlledField} placeholder={field.placeholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormRenderer; 