import { Hono } from "hono";
import { Activity } from "../src/views/activity";
import type { DashboardRequestLog, Stats, User } from "../src/types";

const now = new Date();

const mockUser: User = {
  id: "u_abc123",
  slackId: "U07ABC123",
  email: "testuser@hackclub.com",
  name: "Test User",
  avatar: "https://avatars.githubusercontent.com/u/1?v=4",
  spendingLimitUsd: "8",
  openrouterKey: null,
  openrouterKeyHash: null,
  openrouterKeyLimit: null,
  isIdvVerified: false,
  skipIdv: false,
  isBanned: false,
  agentBannerDismissedAt: null,
  createdAt: new Date(Date.now() - 86400000 * 30),
  updatedAt: new Date(),
};

const mockLogs: DashboardRequestLog[] = [
  {
    id: "r_001",
    model: "openai/gpt-4o",
    promptTokens: 142,
    completionTokens: 89,
    totalTokens: 231,
    cost: "0.00283500",
    timestamp: new Date(now.getTime() - 1000 * 60 * 2),
    duration: 1234,
    ip: "203.0.113.42",
    response: {
      choices: [{ finish_reason: "stop", message: { content: "Hello!" } }],
      usage: { prompt_tokens: 142, completion_tokens: 89, total_tokens: 231 },
    },
    apiKeyName: "Production API Key",
    modelName: "GPT-4o",
  },
  {
    id: "r_002",
    model: "openai/gpt-4o-mini",
    promptTokens: 55,
    completionTokens: 320,
    totalTokens: 375,
    cost: "0.00022500",
    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
    duration: 856,
    ip: "198.51.100.7",
    response: {
      choices: [{ finish_reason: "stop", message: { content: "Sure!" } }],
      usage: { prompt_tokens: 55, completion_tokens: 320, total_tokens: 375 },
    },
    apiKeyName: "Staging Key",
    modelName: "GPT-4o Mini",
  },
  {
    id: "r_003",
    model: "openai/gpt-4o",
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    cost: "0.00000000",
    timestamp: new Date(now.getTime() - 1000 * 60 * 12),
    duration: 5432,
    ip: "192.0.2.15",
    response: {
      error: {
        message: "Rate limit exceeded. Please try again in 20 seconds.",
        code: "rate_limit_exceeded",
      },
    },
    apiKeyName: "Production API Key",
    modelName: "GPT-4o",
  },
  {
    id: "r_004",
    model: "openai/dall-e-3",
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    cost: "0.04000000",
    timestamp: new Date(now.getTime() - 1000 * 60 * 30),
    duration: 3201,
    ip: "203.0.113.99",
    response: {
      data: [{ url: "https://example.com/image.png" }],
    },
    apiKeyName: "Prod Image Key",
    modelName: "DALL-E 3",
  },
  {
    id: "r_005",
    model: "openai/text-embedding-3-small",
    promptTokens: 512,
    completionTokens: 0,
    totalTokens: 512,
    cost: "0.00004200",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60),
    duration: 312,
    ip: "198.51.100.22",
    response: {
      data: [{ embedding: [0.001, 0.002, 0.003] }],
      usage: { prompt_tokens: 512, total_tokens: 512 },
    },
    apiKeyName: "Staging Key",
    modelName: "Text Embedding 3 Small",
  },
  {
    id: "r_006",
    model: "openai/gpt-4o-mini",
    promptTokens: 1200,
    completionTokens: 450,
    totalTokens: 1650,
    cost: "0.00079500",
    timestamp: new Date(now.getTime() - 1000 * 60 * 120),
    duration: 2150,
    ip: "192.0.2.88",
    response: {
      choices: [
        { finish_reason: "stop", message: { content: "Long response" } },
      ],
      usage: {
        prompt_tokens: 1200,
        completion_tokens: 450,
        total_tokens: 1650,
      },
    },
    apiKeyName: "Production API Key",
    modelName: "GPT-4o Mini",
  },
];

const mockStats: Stats = {
  totalRequests: 12847,
  totalTokens: 2458901,
  totalPromptTokens: 1823456,
  totalCompletionTokens: 635445,
};

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <Activity
      user={mockUser}
      stats={mockStats}
      recentLogs={mockLogs}
      hasMoreRecentLogs={true}
      dailySpending={2.45}
    />,
  );
});

const res = await app.fetch(new Request("http://localhost/"));
const html = await res.text();

await Bun.write("test-output/activity.html", html);
console.log("✅ Wrote test-output/activity.html");
