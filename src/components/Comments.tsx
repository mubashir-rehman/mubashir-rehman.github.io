import Giscus from "@giscus/react";
import { useTheme } from "@/components/ThemeProvider";

const THEME_BASE_URL = "https://mubashir-rehman.is-a.dev";

export default function Comments() {
  const { theme } = useTheme();

  const giscusTheme =
    theme === "dark"
      ? `${THEME_BASE_URL}/giscus-dark.css`
      : theme === "sakura"
        ? `${THEME_BASE_URL}/giscus-sakura.css`
        : `${THEME_BASE_URL}/giscus-light.css`;

  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="mb-6 font-heading text-xl font-bold">Comments</h2>
      <Giscus
        id="comments"
        repo={import.meta.env.PUBLIC_GISCUS_REPO}
        repoId={import.meta.env.PUBLIC_GISCUS_REPO_ID}
        category={import.meta.env.PUBLIC_GISCUS_CATEGORY}
        categoryId={import.meta.env.PUBLIC_GISCUS_CATEGORY_ID}
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
