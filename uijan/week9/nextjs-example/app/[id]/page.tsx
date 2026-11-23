// [id]/page.tsx
import { Suspense } from "react";

interface DynamicPageProps {
    params : Promise<{id: string}>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  return (
    <Suspense fallback={<div>DynamicPageLoading...</div>}>
      <DynamicPageScreen params={params} />
    </Suspense>
  );
}

async function DynamicPageScreen({ params }: DynamicPageProps) {
  const { id } = await params;

  return <div>This is Dynamic Page. Current id is {id}.</div>;
}