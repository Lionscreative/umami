import { checkPassword, createSecureToken } from 'lib/crypto';
import { useCors } from 'lib/middleware';
import { getAccountByUsername } from 'lib/queries';
import { ok, unauthorized, badRequest } from 'lib/response';

export default async (req, res) => {
  await useCors(req, res);
  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res);
  }

  const account = await getAccountByUsername(username);

  if (account && (await checkPassword(password, account.password))) {
    const { user_id, username, is_admin } = account;
    const user = { user_id, username, is_admin };
    const token = await createSecureToken(user);

    res.setHeader('Access-Control-Allow-Origin', '*');

    return ok(res, { token, user });
  }

  return unauthorized(res);
};
