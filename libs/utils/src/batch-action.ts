export async function batchAction<T>(data: T[], action: (dataFragments: T[]) => Promise<unknown>, batchSize = 1000) {
  try {
    const loopLength = Math.ceil(data.length / batchSize);
    for (let i = 0; i < loopLength; i++) {
      const dataToProcess = data.splice(0, batchSize);
      await action(dataToProcess);
    }
  } catch (e) {
    console.error(e);
  }
}
