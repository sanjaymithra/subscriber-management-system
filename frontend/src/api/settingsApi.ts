export async function getSettingsModuleStatus() {
  return Promise.resolve({ status: 'ready' as const })
}
