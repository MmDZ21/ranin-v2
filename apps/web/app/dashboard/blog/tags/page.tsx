import { Card, CardBody } from "@/components/ui/Card";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">تگ‌ها</h2>
      <Card>
        <CardBody className="min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
          مدیریت تگ‌ها در این بخش قرار می‌گیرد
        </CardBody>
      </Card>
    </div>
  );
}

