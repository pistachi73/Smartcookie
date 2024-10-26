import { hashPassword } from "@/data-access/utils";
import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import users from "./data/users";

export default async function seed(db: DB) {
  await Promise.all(
    users.map(async (user) => {
      const { password, ...rest } = user;
      const { hashedPassword, salt } = await hashPassword(password);

      await db.insert(schema.user).values({
        ...rest,
        password: hashedPassword,
        salt,
      });
    }),
  );
}
