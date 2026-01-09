import { FieldGroup } from "../ui/field";

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <FieldGroup className="ltr:pl-3 rtl:pr-3 ltr:border-l rtl:border-r border-border">
        {children}
      </FieldGroup>
    </div>
  );
}
