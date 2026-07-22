export default {
  site: {
    title: "Framework Engineering Research",
    description: "Searchable research, evidence, methods, and knowledge artifacts for Framework Engineering",
    baseUrl: "/",
    language: "en",
    siteUrl: "https://github.com/kemiller2002/Framework-engineering"
  },
  repository: {
    name: "Framework-engineering",
    sourceUrl: "https://github.com/kemiller2002/Framework-engineering"
  },
  content: {
    include: [
      "**/*.md"
    ],
    exclude: [
      "node_modules/**",
      "**/node_modules/**",
      "dist/**",
      "build/**",
      "build-reports/**",
      "coverage/**",
      ".git/**",
      ".github/**",
      ".research-publisher/**",
      "tmp/**",
      "temp/**",
      "**/archive/**",
      "**/archives/**",
      "input-documents/**",
      "prompts/**",
      "research/**/generated/**"
    ],
    drafts: false
  },
  metadata: {
    mode: "compatible",
    strictInCI: false
  },
  output: {
    directory: "dist",
    catalog: "data/research-catalog.json",
    diagnostics: "data/build-diagnostics.json"
  }
};
