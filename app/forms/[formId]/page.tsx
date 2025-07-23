"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import all necessary UI components from the project
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

// Import special compound components
import { CreditCardForm } from "@/components/components/credit-card-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import SignatureInput from '@/components/ui/signature-input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader, FileInput, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import LocationSelector from "@/components/ui/location-input";
import { MultiSelector, MultiSelectorTrigger, MultiSelectorInput, MultiSelectorContent, MultiSelectorList, MultiSelectorItem } from "@/components/ui/multi-select";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Rating } from "@/components/ui/rating";
import { TagsInput } from "@/components/ui/tags-input";

// --- Types ---
type FormElement = {
  id?: string;
  name?: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type FormStructure = {
  json: { fields: FormElement[] };
  name: string;
  id: string;
};

// --- Child Component for Rendering the Form ---
function getFieldType(field: FormElement): string {
  if (field.type && field.type !== "") return field.type;
  const label = field.label?.toLowerCase() || "";
  if (label.includes("date of birth") || label.includes("submission date")) return "date";
  if (label.includes("file")) return "file";
  if (label.includes("password")) return "password";
  if (label.includes("phone")) return "phone";
  if (label.includes("bio")) return "textarea";
  if (label.includes("sign")) return "signature";
  if (label.includes("slider") || label.includes("price")) return "slider";
  if (label.includes("country")) return "location";
  if (label.includes("framework")) return "multi-select";
  if (label.includes("otp")) return "otp";
  if (label.includes("email")) return "select";
  if (label.includes("gender")) return "radio-group";
  if (label.includes("rating")) return "rating";
  if (label.includes("tags")) return "tags";
  if (label.includes("marketing emails")) return "switch";
  if (label.includes("use different settings")) return "checkbox";
  return "input";
}

function renderField(field: FormElement, controlledField: any, extra: any = {}) {
  const type = getFieldType(field);
  switch (type) {
    case "checkbox":
      return <Checkbox checked={controlledField.value} onCheckedChange={controlledField.onChange} />;
    case "switch":
      return <Switch checked={controlledField.value} onCheckedChange={controlledField.onChange} />;
    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !controlledField.value && "text-muted-foreground")}> 
              <CalendarIcon className="mr-2 h-4 w-4" />
              {controlledField.value ? format(new Date(controlledField.value), "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={controlledField.value ? new Date(controlledField.value) : undefined} onSelect={controlledField.onChange} initialFocus />
          </PopoverContent>
        </Popover>
      );
    case "file":
      return (
        <FileUploader value={extra.files} onValueChange={extra.setFiles} dropzoneOptions={extra.dropZoneConfig} className="relative bg-background rounded-lg p-2">
          <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
            <div className="flex items-center justify-center flex-col p-8 w-full ">
              <CloudUpload className='text-gray-500 w-10 h-10' />
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp; or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
            </div>
          </FileInput>
          <FileUploaderContent>
            {extra.files && extra.files.length > 0 && extra.files.map((file: File, i: number) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
          </FileUploaderContent>
        </FileUploader>
      );
    case "password":
      return <PasswordInput placeholder={field.placeholder} {...controlledField} />;
    case "phone":
      return <PhoneInput placeholder={field.placeholder} {...controlledField} defaultCountry="TR" />;
    case "textarea":
      return <Textarea placeholder={field.placeholder} {...controlledField} className="resize-none" />;
    case "signature":
      return <SignatureInput canvasRef={extra.canvasRef} onSignatureChange={controlledField.onChange} />;
    case "slider":
      return <Slider min={0} max={100} step={5} defaultValue={[5]} onValueChange={(vals) => controlledField.onChange(vals[0])} />;
    case "location":
      return <LocationSelector onCountryChange={extra.onCountryChange} onStateChange={extra.onStateChange} />;
    case "multi-select":
      return (
        <MultiSelector values={Array.isArray(controlledField.value) ? controlledField.value : []} onValuesChange={controlledField.onChange} loop className="max-w-xs">
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select languages" />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              <MultiSelectorItem value="React">React</MultiSelectorItem>
              <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
              <MultiSelectorItem value="Svelte">Svelte</MultiSelectorItem>
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
      );
    case "otp":
      return (
        <InputOTP maxLength={6} {...controlledField}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      );
    case "select":
      return (
        <Select onValueChange={controlledField.onChange} defaultValue={controlledField.value}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      );
    case "radio-group":
      return (
        <RadioGroup onValueChange={controlledField.onChange} className="flex flex-col space-y-1">
          {["Male", "Female", "Other"].map((option, index) => (
            <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={option.toLowerCase()} />
              </FormControl>
              <FormLabel className="font-normal">{option}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      );
    case "tags":
      return <TagsInput value={controlledField.value} onValueChange={controlledField.onChange} placeholder="Enter your tags" />;
    case "rating":
      return <Rating {...controlledField} />;
    default:
      return <Input placeholder={field.placeholder} {...controlledField} />;
  }
}

function FormRenderer({ formStructure, files, setFiles, dropZoneConfig, countryName, setCountryName, stateName, setStateName, canvasRef }: {
  formStructure: FormStructure,
  files: File[] | null,
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>,
  dropZoneConfig: any,
  countryName: string,
  setCountryName: React.Dispatch<React.SetStateAction<string>>,
  stateName: string,
  setStateName: React.Dispatch<React.SetStateAction<string>>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}): React.ReactElement | null {
  const fields = Array.isArray(formStructure?.json?.fields) ? formStructure.json.fields : [];
  const normalizedFields = fields.map((field: FormElement) => ({
    ...field,
    id: field.id || field.name,
  }));
  const formSchema = useMemo(() => {
    return z.object(
      normalizedFields.reduce((acc: Record<string, z.ZodTypeAny>, field: FormElement) => {
        if (!field.id) return acc;
        let schema: z.ZodTypeAny;

        switch(field.type) {
            case 'checkbox':
            case 'switch':
              schema = z.boolean().default(false);
              if (field.required) schema = schema.refine(val => val === true, { message: `${field.label} is required.` });
              break;
            case 'date':
                schema = z.date({ coerce: true });
                if(!field.required) schema = schema.optional();
                break;
            case 'slider':
                schema = z.number().optional();
                break;
            default:
              const stringSchema = z.string();
              if (field.required) {
                schema = stringSchema.min(1, { message: `${field.label} is required.` });
              } else {
                schema = stringSchema.optional().default('');
              }
              break;
        }
        acc[field.id] = schema;
        return acc;
      }, {} as Record<string, z.ZodTypeAny>)
    );
  }, [normalizedFields]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => normalizedFields.reduce((acc: Record<string, any>, field: FormElement) => {
      if (!field.id) return acc;
      if (getFieldType(field) === 'multi-select') {
        acc[field.id] = [];
      } else if (field.type === 'checkbox' || field.type === 'switch') {
        acc[field.id] = false;
      } else {
        acc[field.id] = '';
      }
      return acc;
    }, {} as Record<string, any>), [normalizedFields]),
  });
  if (normalizedFields.length === 0) {
    return <div className="text-center text-red-500">No fields found in this form.</div>;
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.success("Form submitted successfully!");
    console.log(data);
    await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: formStructure.id, data: data }),
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{formStructure.name}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {normalizedFields.filter((f: FormElement) => !!f.id).map((field: FormElement) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id as any}
              render={({ field: controlledField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {renderField(field, controlledField, { files, setFiles, dropZoneConfig, countryName, setCountryName, stateName, setStateName, canvasRef })}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

// --- Main Page Component ---
export default function PublicFormPage({ params }: { params: { formId: string } }) {
  const { formId } = params;
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');
  const dropZoneConfig = { maxFiles: 5, maxSize: 1024 * 1024 * 4, multiple: true };
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/forms/${formId}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error('Failed to fetch form data');
        const data = await res.json();
        console.log('Fetched form data:', data); // Debug log
        // Patch: If data.json is an array, wrap it in { fields: data.json }
        let json = data.json;
        if (Array.isArray(json)) {
          json = { fields: json };
        }
        setFormStructure({ ...data, json, id: formId });
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading form...</div>;
  if (notFound) return <div className="flex justify-center items-center h-screen"><h1>404 | Form Not Found</h1></div>;
  if (!formStructure) return <div className="flex justify-center items-center h-screen text-red-500">No form data loaded.</div>;

  return <FormRenderer formStructure={formStructure} files={files} setFiles={setFiles} dropZoneConfig={dropZoneConfig} countryName={countryName} setCountryName={setCountryName} stateName={stateName} setStateName={setStateName} canvasRef={canvasRef} />;
} 