CREATE TABLE IF NOT EXISTS "t3wa_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "t3wa_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3wa_passwordResetToken" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "t3wa_passwordResetToken_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3wa_twoFactorConfirmation" (
	"id" text PRIMARY KEY NOT NULL,
	"user" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3wa_twoFactorToken" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "t3wa_twoFactorToken_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3wa_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"password" text,
	"role" text DEFAULT 'USER',
	"isTwoFactorEnabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3wa_verificationToken" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "t3wa_verificationToken_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3wa_account" ADD CONSTRAINT "t3wa_account_userId_t3wa_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."t3wa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3wa_twoFactorConfirmation" ADD CONSTRAINT "t3wa_twoFactorConfirmation_user_t3wa_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."t3wa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "t3wa_user_email_index" ON "t3wa_user" USING btree ("email");