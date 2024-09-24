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