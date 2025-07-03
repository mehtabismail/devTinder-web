// Query Keys Factory for consistent and type-safe query key management
export const queryKeys = {
  // Auth related queries
  auth: {
    all: ["auth"],
    user: () => [...queryKeys.auth.all, "user"],
    profile: (userId) => [...queryKeys.auth.all, "profile", userId],
  },

  // User related queries
  users: {
    all: ["users"],
    lists: () => [...queryKeys.users.all, "list"],
    list: (filters) => [...queryKeys.users.lists(), { filters }],
    details: () => [...queryKeys.users.all, "detail"],
    detail: (userId) => [...queryKeys.users.details(), userId],
  },

  // Matches related queries
  matches: {
    all: ["matches"],
    lists: () => [...queryKeys.matches.all, "list"],
    list: (filters) => [...queryKeys.matches.lists(), { filters }],
    details: () => [...queryKeys.matches.all, "detail"],
    detail: (matchId) => [...queryKeys.matches.details(), matchId],
  },

  // Messages related queries
  messages: {
    all: ["messages"],
    lists: () => [...queryKeys.messages.all, "list"],
    list: (conversationId) => [...queryKeys.messages.lists(), conversationId],
    details: () => [...queryKeys.messages.all, "detail"],
    detail: (messageId) => [...queryKeys.messages.details(), messageId],
  },

  // Conversations related queries
  conversations: {
    all: ["conversations"],
    lists: () => [...queryKeys.conversations.all, "list"],
    list: (filters) => [...queryKeys.conversations.lists(), { filters }],
    details: () => [...queryKeys.conversations.all, "detail"],
    detail: (conversationId) => [
      ...queryKeys.conversations.details(),
      conversationId,
    ],
  },

  // Settings related queries
  settings: {
    all: ["settings"],
    user: () => [...queryKeys.settings.all, "user"],
    preferences: () => [...queryKeys.settings.all, "preferences"],
  },
};
