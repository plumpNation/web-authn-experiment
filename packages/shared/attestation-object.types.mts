/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse/attestationObject
 */

export type ES256 = -7;
export type AttestationAlgorithm = ES256 | -257 | -37 | -38 | -39 | -258 | -259 | -65535 | -65536 | -65537 | -258 | -259 | -65535 | -65536 | -65537;

export type PackedAttestationObject = {
  fmt: 'packed';
  authData: Buffer;
  attStmt: {
    alg: AttestationAlgorithm;
    sig: Buffer;
    /**
     * An array of Buffers containing certificates
     * (only present in "full" attestation mode).
     */
    x5c?: Buffer[] | null;
  };
};

export type AttestationObject =
  | PackedAttestationObject;

export type ClientDataType = 'webauthn.create' | 'webauthn.get';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON
 */
export type ClientData = {
  type: ClientDataType;
  /**
   * The base64url encoded version of the cryptographic challenge
   * sent from the relying party's server. The original value are
   * passed as the challenge option in `CredentialsContainer.get()`
   * or `CredentialsContainer.create()`.
   */
  challenge: string;
  /**
   * The fully qualified origin of the relying party which has been
   * given by the client/browser to the authenticator. We should
   * expect the relying party's id to be a suffix of this value.
   */
  origin: string;
  /**
   * If set to true, it means that the calling context is
   * an <iframe> that is not same origin with its ancestor frames.
   */
  crossOrigin?: boolean | null;
  /**
   * The fully qualified origin of the client which has been
   * given by the client/browser to the authenticator.
   * Is only set if the crossOrigin property is set to `true`.
   */
  topOrigin?: string | null;
  /**
   * Should this property be absent, it would indicate
   * that the client does not support token binding.
   * @deprecated since Level 3 of the specification
   */
  tokenBinding?: {
    /**
     * The base64url encoding of the token binding ID which
     * was used for the communication.
     */
    id: string;
    status: 'present' | 'supported' | 'not-supported';
  };
};