/* eslint-disable import/no-anonymous-default-export */
import { ok, notFound, methodNotAllowed } from 'lib/response';
import { createToken } from 'lib/crypto';
import { useCors } from 'lib/middleware';
import { getWebsiteByDomain } from 'lib/queries';

export default async (req, res) => {
  await useCors(req, res);

  const { id } = req.query;

  if (req.method === 'GET') {
    const website = await getWebsiteByDomain(id);

    if (website) {
      const websiteId = website.website_id;
      const token = await createToken({ website_id: websiteId });

      return ok(res, { websiteId, token });
    }

    return notFound(res);
  }

  return methodNotAllowed(res);
};
