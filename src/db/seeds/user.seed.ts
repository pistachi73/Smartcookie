import { hashPassword } from "@/data-access/utils";
import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import users from "./data/users.seed-data";

export default async function seed(db: DB) {
  console.log("Seeding users...");
  await Promise.all(
    users.map(async (user) => {
      if (user.email === "infomartinamotiva@gmail.com") {
        return;
      }

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
