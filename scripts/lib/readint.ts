import copyPaste from 'copy-paste';

export function readint(length: number): number {
  const randint =
    Math.ceil(Math.random() * 9) * Math.pow(10, length - 1) +
    Math.floor(Math.random() * Math.pow(10, length - 1));

  copyPaste.copy('' + randint);

  return randint;
}
