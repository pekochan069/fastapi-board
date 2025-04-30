import type { APIContext } from "astro";

export async function GET({ params, redirect }: APIContext) {
  const id = params.id;
  const url = `/board/${id}/all`;
  return redirect(url, 301);
}
