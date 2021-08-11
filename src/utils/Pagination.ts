type Props = {
  skip?: string | number;
  limit?: string | number;
};
export function parsePagination(
  { skip, limit }: Props,
  maxLimit = 25,
): {
  skip: number;
  limit: number;
} {
  return {
    skip: Number(skip || 0),
    limit: Math.min(Number(limit || maxLimit), maxLimit),
  };
}
