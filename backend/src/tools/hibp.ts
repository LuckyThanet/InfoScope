import axios from 'axios';

export const runHibp = async (hash: string) => {
  // const password = req.params.password;

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
      return {
        breached: true,
        count: count,
        message: `Password has been pwned ${count} times.`,
      };
    } else {
      return {
        breached: false,
        message: 'Password is safe (not found in HIBP).',
      };
    }
  } catch (error) {
    console.error('Error checking password:', error);
    return { error: 'Failed to check password.' };
  }
};
