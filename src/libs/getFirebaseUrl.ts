export const getFirebaseUrl = <
  T extends string | null | undefined,
  K extends T extends string ? string : undefined
>(
  id: T
) =>
  (typeof id === 'string'
    ? `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_projectId}.appspot.com/${id}`
    : undefined) as K;
