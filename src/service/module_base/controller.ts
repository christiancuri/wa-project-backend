import { Req, Res } from "@types";

import * as service from "./service";

export async function login(req: Req, res: Res): Promise<void> {
  const data = await service.example({ props: undefined });
  res.json(data);
}
