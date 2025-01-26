import { UpdateEmail } from "@/components/account/update-email";
import { DangerZone } from "./danger-zone";
import { UpdateNameAvatar } from "./update-name-avatar";
import { UpdatePassword } from "./update-password";
import { UpdateTFA } from "./update-tfa";

export const Account = () => {
  return (
    <div className="flex flex-col gap-9">
      <div className="space-y-2">
        <h1 className="font-bold tracking-tighter text-4xl">Account</h1>
        <p className="text-md text-foreground">Details of the account</p>
      </div>

      <div className="space-y-4">
        <UpdateNameAvatar />
        <UpdateEmail />
        <UpdatePassword />
        <UpdateTFA />
        <DangerZone />
      </div>
    </div>
  );
};
