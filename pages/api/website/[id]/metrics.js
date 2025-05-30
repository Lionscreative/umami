import { getPageviewMetrics, getSessionMetrics, getWebsiteById } from 'lib/queries';
import { ok, methodNotAllowed, unauthorized, badRequest } from 'lib/response';
import { allowQuery } from 'lib/auth';
import { useCors } from 'lib/middleware';

const sessionColumns = ['browser', 'os', 'device', 'country', 'language'];
const pageviewColumns = ['url', 'referrer'];

function getTable(type) {
  if (type === 'event') {
    return 'event';
  }

  if (sessionColumns.includes(type)) {
    return 'session';
  }

  return 'pageview';
}

function getColumn(type) {
  if (type === 'event') {
    return `concat(event_type, '\t', event_value)`;
  }
  return type;
}

export default async (req, res) => {
   await useCors(req, res);
  
  if (req.method === 'GET') {
    if (!(await allowQuery(req))) {
      return unauthorized(res);
    }

    const { id, type, start_at, end_at, url } = req.query;

    const websiteId = +id;
    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    if (sessionColumns.includes(type)) {
      let data = await getSessionMetrics(websiteId, startDate, endDate, type, { url });

      if (type === 'language') {
        let combined = {};

        for (let { x, y } of data) {
          x = String(x).toLowerCase().split('-')[0];
          if (!combined[x]) combined[x] = { x, y };
          else combined[x].y += y;
        }

        data = Object.values(combined);
      }

      return ok(res, data);
    }

    if (pageviewColumns.includes(type) || type === 'event') {
      let domain;
      if (type === 'referrer') {
        const website = getWebsiteById(websiteId);

        if (!website) {
          return badRequest(res);
        }

        domain = website.domain;
      }

      const data = await getPageviewMetrics(
        websiteId,
        startDate,
        endDate,
        getColumn(type),
        getTable(type),
        {
          domain,
          url: type !== 'url' && url,
        },
      );

      return ok(res, data);
    }
  }

  return methodNotAllowed(res);
};
