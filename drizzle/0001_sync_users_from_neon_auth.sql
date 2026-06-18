CREATE OR REPLACE FUNCTION public.sync_user_from_neon_auth()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.users WHERE id = OLD.id::text;
    RETURN OLD;
  END IF;

  INSERT INTO public.users (id, name, email, image, created_at)
  VALUES (NEW.id::text, NEW.name, NEW.email, NEW.image, NEW."createdAt")
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    image = EXCLUDED.image;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS sync_user_from_neon_auth_trigger ON neon_auth."user";
--> statement-breakpoint
CREATE TRIGGER sync_user_from_neon_auth_trigger
AFTER INSERT OR UPDATE OR DELETE ON neon_auth."user"
FOR EACH ROW EXECUTE FUNCTION public.sync_user_from_neon_auth();
