import Giscus from "@giscus/react";
import { useTheme } from "@/components/ThemeProvider";

const THEME_BASE_URL = "https://mubashir-rehman.github.io";

export default function Comments() {
  const { theme } = useTheme();

  const giscusTheme =
    theme === "dark"
      ? `${THEME_BASE_URL}/giscus-dark.css`
      : `${THEME_BASE_URL}/giscus-light.css`;

  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="mb-6 font-heading text-xl font-bold">Comments</h2>
      <Giscus
        id="comments"
        repo={import.meta.env.VITE_GISCUS_REPO}
        repoId={import.meta.env.VITE_GISCUS_REPO_ID}
        category={import.meta.env.VITE_GISCUS_CATEGORY}
        categoryId={import.meta.env.VITE_GISCUS_CATEGORY_ID}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
