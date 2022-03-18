/* eslint-disable import/no-anonymous-default-export */
import { updateWebsite, createWebsite, getWebsiteById, getWebsiteByDomain } from 'lib/queries';
import { useAuth, useCors } from 'lib/middleware';
import { uuid, getRandomChars } from 'lib/crypto';
import { ok, unauthorized, methodNotAllowed } from 'lib/response';

export default async (req, res) => {
  await useCors(req, res);

  await useAuth(req, res);

  const { user_id, is_admin } = req.auth;
  const { website_id, enable_share_url } = req.body;

  if (req.method === 'POST') {
    const { name, domain } = req.body;

    if (website_id) {
      const website = await getWebsiteById(website_id);

      if (website.user_id !== user_id && !is_admin) {
        return unauthorized(res);
      }

      let { share_id } = website;

      if (enable_share_url) {
        share_id = share_id ? share_id : getRandomChars(8);
      } else {
        share_id = null;
      }

      await updateWebsite(website_id, { name, domain, share_id });

      return ok(res);
    } else {
      // Add filter on domain to avoid multiple same domain to be added in database
      if (domain) {
        const found = await getWebsiteByDomain(domain);

        if (!found) {
          const website_uuid = uuid();
          const share_id = enable_share_url ? getRandomChars(8) : null;
          const website = await createWebsite(user_id, { website_uuid, name, domain, share_id });

          return ok(res, website);
        }
      }
    }
  }

  return methodNotAllowed(res);
};
