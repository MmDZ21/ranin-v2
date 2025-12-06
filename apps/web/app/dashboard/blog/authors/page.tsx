import { Card, CardBody } from "@/components/ui/Card";

export default function AuthorsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">نویسندگان</h2>
      <Card>
        <CardBody className="min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
          مدیریت نویسندگان در این بخش قرار می‌گیرد
        </CardBody>
      </Card>
    </div>
  );
}

