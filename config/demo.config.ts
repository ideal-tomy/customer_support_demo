export const demoConfig = {
  demoId: "customer-support",
  /** @axeon/ai-demo-core configureDemoCore 用 */
  id: "customer-support",
  demoName: "カスタマーサポートAI",
  name: "カスタマーサポートAI",
  description:
    "東和ライフストア向け：FAQ・カタログを根拠に接客し、自社ナレッジ投入も試せるチャットデモ",
  demoType: "chat" as const,
  defaultMode: "sample" as const,
  defaultAccessMode: "sample" as const,
  trialPortalEnabled: true,
  storageNamespace: "customer-support",
  defaultRoleId: "customer",
  defaultProvider: "openai" as const,
  defaultModel: "gpt-5-nano",
  knowledgePolicy: {
    recommendedMax: 20000,
    warningFrom: 20001,
    hardLimit: 30000,
  },
  chat: {
    maxHistoryMessages: 8,
  },
};

export type DemoConfig = typeof demoConfig;
