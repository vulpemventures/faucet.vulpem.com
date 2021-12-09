export default async function loader<T>(
  promise: Promise<T>,
  updater: (loading: boolean) => void
): Promise<T> {
  updater(true);
  try {
    return await promise;
  } catch (err) {
    throw err;
  } finally {
    updater(false);
  }
}
