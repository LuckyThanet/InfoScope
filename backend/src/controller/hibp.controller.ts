import axios from 'axios';
import { Request, Response } from 'express';

export const checkPasswordHibp = async (req: Request, res: Response) => {
  const hash = req.body.hash;
  // const password = req.params.password;

  if (!hash) {
    return res.status(400).json({ error: 'Missing password in body' });
  }

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true',
      },
    });

    // console.log(response.data);

    const lines = response.data.split('\n');
    const match = lines.find((line: string) => line.startsWith(suffix));

    if (match) {
      const [, raw_count] = match.split(':');
      const count = parseInt(raw_count.trim(), 10);
      return res.status(200).json({
        breached: true,
        count: count,
        message: `Password has been pwned ${count} times.`,
      });
    } else {
      return res.status(200).json({
        breached: false,
        message: 'Password is safe (not found in HIBP).',
      });
    }
  } catch (error) {
    console.error('Error checking password:', error);
    return res.status(500).json({ error: 'Failed to check password.' });
  }
};
