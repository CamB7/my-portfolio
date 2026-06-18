CREATE OR REPLACE FUNCTION public.sync_user_from_neon_auth()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.users WHERE id = OLD.id::text;
    RETURN OLD;
  END IF;

  INSERT INTO public.users (id, name, email, image, created_at)
  VALUES (
    NEW.id::text,
    COALESCE(NULLIF(NEW.name, ''), split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.image,
    NEW."createdAt"
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    image = EXCLUDED.image;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO neon_auth;
