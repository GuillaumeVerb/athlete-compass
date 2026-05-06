import { BilanDetailClient } from "../bilan-detail-client";

export default async function BilanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BilanDetailClient id={id} />;
}
