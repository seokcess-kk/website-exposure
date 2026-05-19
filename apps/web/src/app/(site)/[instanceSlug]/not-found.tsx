export default function SiteNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-fg-default">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-fg-muted">요청하신 페이지가 존재하지 않거나, 이동되었거나, 비공개 상태입니다.</p>
    </main>
  );
}
