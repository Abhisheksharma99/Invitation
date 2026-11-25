// Any address that is not a page is treated as the invitation itself, so a
// personal link such as /Sharma-Ji still opens it (and greets the guest) on
// hosts that do not apply the rewrite in vercel.json.
export { default } from "./page";
