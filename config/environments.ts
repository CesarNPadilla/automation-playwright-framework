export function getEnvironments() {
  return {
    dev:     process.env.DEV_BASE_URL     || '',
    qa:      process.env.QA_BASE_URL      || '',
    staging: process.env.STAGING_BASE_URL || '',
    prod:    process.env.PROD_BASE_URL    || '',
  } as const;
}

export type Environment = keyof ReturnType<typeof getEnvironments>;
