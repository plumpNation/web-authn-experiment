const credInit: PasswordCredentialInit = {
  id: "1234",
  name: "Serpentina",
  origin: "https://example.org",
  password: "the last visible dog",
};

const createPasswordCred = async (): Promise<PasswordCredential | null> =>
  await navigator.credentials.create({
    // password can be a DOM <form> or a PasswordCredentialInit
    password: credInit,
  }) as PasswordCredential;

const getPasswordCred = async (): Promise<PasswordCredential | null> =>
  await navigator.credentials.get() as PasswordCredential;

const randomStringFromServer = Math.random().toString(36).substring(2, 15);
const challenge = Uint8Array.from(randomStringFromServer, c => c.charCodeAt(0));

const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
  challenge,
  rp: {
      name: "Plumpatron",
      id: "localhost",
  },
  user: {
      id: Uint8Array.from("UZSL85T9AFC", c => c.charCodeAt(0)),
      name: "gavin.king@cgi.com",
      displayName: "Gavin King",
  },
  pubKeyCredParams: [{alg: -7, type: "public-key"}],
  authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
  },
  timeout: 60000,
  attestation: "direct"
};

const getPublicKeyCred = async () =>
  await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions
  });