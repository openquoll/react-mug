import copyPaste from 'copy-paste';
import crypto from 'crypto';

export function readsha(shaLength: number): string {
  const sha = crypto.createHash('sha1');
  sha.update('' + Date.now());
  sha.update('' + Math.random());

  let shaDigest = sha.digest('hex');
  if (typeof shaLength === 'number') {
    shaDigest = shaDigest.substring(0, shaLength);
  }

  copyPaste.copy(shaDigest);

  return shaDigest;
}
