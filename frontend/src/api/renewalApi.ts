export async function getRenewalModuleStatus() {
  return Promise.resolve({ status: 'ready' as const })
}
