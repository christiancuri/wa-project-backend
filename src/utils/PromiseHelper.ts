import pLimit from "p-limit";

export async function run<Item = any, Response = any>(
  array: Item[],
  callback: (v?: Item, i?: number, a?: Item[]) => Response,
  concurrency = 25,
): Promise<Response[]> {
  const pool = pLimit(Math.min(concurrency, 25));

  const promises = array.map((v, i, a) =>
    pool(async () => await callback(v, i, a)),
  );

  const results: Response[] = await Promise.all(promises);

  return results;
}
