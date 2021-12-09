export async function promiser<T>(promise: Promise<T>, subscriber: (loading: boolean) => void): Promise<T> {
	subscriber(true)
	try {
		return await promise
	} catch (err) {
		throw err
	}
	finally {
		subscriber(false)
	}
}
